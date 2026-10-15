"""
Build the map and parcel statistics for the Beverly zoning guide (/experiments/beverly-zoning).

Source: MassGIS Level 3 standardized assessor parcels for Beverly (town 30), the file
L3_SHP_M030_BEVERLY.zip, which pairs the city's parcel map with the assessor's table. The
assessor table carries a ZONING field, defined by MassGIS as the "zoning district within which
the property lies not including overlay zoning districts". That field is the assessor's record,
not the City's official zoning map, so the outputs are an approximation of the map: good for
"what zone is my street in", not a legal determination.

Outputs (paths relative to the repo root):
  public/experiments/beverly-zoning/districts.geojson  one feature per base district, parcels
                                                       dissolved by zone code (streets and
                                                       water are left out, so they show as gaps)
  public/experiments/beverly-zoning/addresses.json     street address -> zone, lot size, point
                                                       (no owner names, values or sale data)
  data/beverly/zoning-parcels.json                     per-district counts and acreage
  data/beverly/zoning-minimap.json                     pre-projected SVG outlines for thumbnails

Run from the repo root (needs pyshp, shapely and pyproj):
  pip install pyshp shapely pyproj
  python3 scripts/beverly-zoning/build_zoning_data.py --src /path/to/L3_SHP_M030_Beverly
Without --src it downloads the zip from MassGIS into a temporary folder first.
"""

import argparse
import collections
import glob
import io
import json
import os
import statistics
import tempfile
import urllib.request
import zipfile

import shapefile
from pyproj import Transformer
import shapely
from shapely.geometry import mapping, shape
from shapely.ops import polylabel, unary_union

SOURCE_URL = (
    "https://s3.us-east-1.amazonaws.com/download.massgis.digital.mass.gov/"
    "shapefiles/l3parcels/L3_SHP_M030_BEVERLY.zip"
)
SQFT_PER_ACRE = 43560
M2_PER_ACRE = 4046.8564224
M2_PER_SQFT = 0.09290304

# Assessor use codes (Massachusetts DOR property type classification) folded into the handful of
# categories a reader needs. The first digit is the tax class: 1 residential, 3 commercial,
# 4 industrial, 6-8 Chapter 61 programs, 9 exempt; 0xx is mixed use.
def use_class(code: str) -> str:
    code = (code or "").strip()
    if code == "101":
        return "single"
    if code == "102":
        return "condo"
    if code == "104":
        return "two"
    if code == "105":
        return "three"
    if code in ("111", "112"):
        return "apartments"
    if code in ("130", "131", "132"):
        return "vacantRes"
    if code.startswith("1"):
        return "otherRes"
    if code.startswith("0"):
        return "mixed"
    if code.startswith("3"):
        return "commercial"
    if code.startswith("4"):
        return "industrial"
    if code.startswith("9"):
        return "exempt"
    if code[:1] in ("6", "7", "8"):
        return "chapter61"
    return "other"


def find_layer(src: str, pattern: str) -> str:
    hits = glob.glob(os.path.join(src, "**", pattern), recursive=True)
    if not hits:
        raise SystemExit(f"No file matching {pattern} under {src}")
    return hits[0]


def download(dest: str) -> str:
    print(f"Downloading {SOURCE_URL}")
    with urllib.request.urlopen(SOURCE_URL) as resp:
        data = resp.read()
    zipfile.ZipFile(io.BytesIO(data)).extractall(dest)
    return dest


def rounded(geom, places=5):
    def rnd(coords):
        if isinstance(coords[0], (float, int)):
            return [round(coords[0], places), round(coords[1], places)]
        return [rnd(c) for c in coords]

    g = mapping(geom)
    return {"type": g["type"], "coordinates": rnd(g["coordinates"])}


def drop_small_holes(geom, min_area_m2):
    from shapely.geometry import MultiPolygon, Polygon

    def clean(p):
        holes = [r for r in p.interiors if Polygon(r).area >= min_area_m2]
        return Polygon(p.exterior, holes)

    if geom.geom_type == "Polygon":
        return clean(geom)
    return MultiPolygon([clean(p) for p in geom.geoms])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", help="folder holding the extracted L3_SHP_M030_Beverly files")
    ap.add_argument("--out-root", default=".", help="repo root (default: current directory)")
    args = ap.parse_args()

    src = args.src or download(tempfile.mkdtemp(prefix="massgis-beverly-"))
    taxpar_path = find_layer(src, "M030TaxPar_*.shp")
    assess_path = find_layer(src, "M030Assess_*.dbf")
    vintage = os.path.basename(assess_path).replace("M030Assess_", "").replace(".dbf", "")

    # ---- assessor records, grouped by parcel (condominium buildings have one record per unit)
    assess = shapefile.Reader(assess_path)
    afields = [f[0] for f in assess.fields[1:]]
    by_loc = collections.defaultdict(list)
    fiscal_year = None
    for rec in assess.iterRecords():
        r = dict(zip(afields, rec))
        by_loc[r["LOC_ID"]].append(r)
        fiscal_year = fiscal_year or r["FY"]

    to_wgs84 = Transformer.from_crs("EPSG:26986", "EPSG:4326", always_xy=True).transform

    # ---- parcels
    taxpar = shapefile.Reader(taxpar_path)
    tfields = [f[0] for f in taxpar.fields[1:]]
    zone_geoms = collections.defaultdict(list)
    stats = collections.defaultdict(
        lambda: {"parcels": 0, "acres": 0.0, "records": 0, "uses": collections.Counter(), "lots": []}
    )
    other_area = collections.Counter()
    other_geoms = []
    addresses = {}
    conflicts = 0

    for sr in taxpar.iterShapeRecords():
        p = dict(zip(tfields, sr.record))
        geom = shape(sr.shape.__geo_interface__)
        if not geom.is_valid:
            geom = geom.buffer(0)
        recs = by_loc.get(p["LOC_ID"])
        if not recs:
            other_area[p["POLY_TYPE"]] += geom.area
            if p["POLY_TYPE"] != "WATER":
                other_geoms.append(geom)
            continue

        zones = collections.Counter(r["ZONING"].strip() for r in recs)
        if len(zones) > 1:
            conflicts += 1
        zone = zones.most_common(1)[0][0]
        classes = collections.Counter(use_class(r["USE_CODE"]) for r in recs)
        parcel_use = classes.most_common(1)[0][0]

        # Lot size: the assessor's figure (acres) when it has one, else the mapped polygon.
        lot_acres = max((r["LOT_SIZE"] or 0) for r in recs)
        lot_sqft = lot_acres * SQFT_PER_ACRE if lot_acres > 0 else geom.area / M2_PER_SQFT

        s = stats[zone]
        s["parcels"] += 1
        s["acres"] += geom.area / M2_PER_ACRE
        s["records"] += len(recs)
        s["uses"][parcel_use] += 1
        if parcel_use == "single":
            s["lots"].append(lot_sqft)
        zone_geoms[zone].append(geom)

        pt = shapely.transform(geom.representative_point(), to_wgs84, interleaved=False)
        for r in recs:
            num = (r["ADDR_NUM"] or "").strip()
            street = (r["FULL_STR"] or "").strip()
            if not street or num in ("", "0"):
                continue
            addr = f"{num} {street}".upper()
            if addr in addresses:
                continue
            addresses[addr] = [
                addr,
                zone,
                round(pt.y, 5),
                round(pt.x, 5),
                int(round(lot_sqft, -1)),
                parcel_use,
            ]

    # ---- dissolve by zone, clean slivers, simplify, reproject
    features = []
    labels = []
    for zone, geoms in sorted(zone_geoms.items()):
        merged = unary_union(geoms).buffer(0.75).buffer(-0.75)
        merged = drop_small_holes(merged, 60.0)
        merged = merged.simplify(1.0, preserve_topology=True)
        # Label points so the map can print the district code on each area instead of leaning on
        # color. Bigger areas get labels at lower zoom; slivers under ~1 acre get none.
        parts = [merged] if merged.geom_type == "Polygon" else list(merged.geoms)
        for part in parts:
            if part.area < 4000:
                continue
            pt = shapely.transform(polylabel(part, tolerance=2.0), to_wgs84, interleaved=False)
            min_zoom = 13 if part.area > 400000 else 14 if part.area > 60000 else 15 if part.area > 15000 else 16
            labels.append([zone, round(pt.y, 5), round(pt.x, 5), min_zoom])
        features.append(
            {
                "type": "Feature",
                "properties": {
                    "zone": zone,
                    "acres": round(stats[zone]["acres"], 1),
                    "parcels": stats[zone]["parcels"],
                },
                "geometry": rounded(shapely.transform(merged, to_wgs84, interleaved=False)),
            }
        )

    # ---- thumbnails: SVG paths in state plane meters (the source CRS, a conformal projection),
    # scaled to a 1000-unit-wide box. Streets are closed over so each zone reads as a solid
    # shape at thumbnail size, and the whole city gets one silhouette to draw underneath.
    land = [g for gs in zone_geoms.values() for g in gs]
    city = unary_union(land + other_geoms).buffer(15).buffer(-15)
    city = drop_small_holes(city, 40000.0).simplify(12, preserve_topology=True)
    minx, miny, maxx, maxy = city.bounds
    width = 1000.0
    scale = width / (maxx - minx)
    height = round((maxy - miny) * scale, 1)

    def svg_path(geom):
        polys = [geom] if geom.geom_type == "Polygon" else list(geom.geoms)
        parts = []
        for poly in polys:
            for ring in [poly.exterior, *poly.interiors]:
                pts = [f"{(x - minx) * scale:.1f} {(maxy - y) * scale:.1f}" for x, y in ring.coords[:-1]]
                if len(pts) >= 3:
                    parts.append("M" + "L".join(pts) + "Z")
        return "".join(parts)

    thumbs = {}
    for zone, geoms in sorted(zone_geoms.items()):
        g = unary_union(geoms).buffer(12).buffer(-12)
        g = drop_small_holes(g, 20000.0).simplify(10, preserve_topology=True)
        g = g.intersection(city.buffer(1))
        thumbs[zone] = svg_path(g)

    with open(os.path.join(args.out_root, "data", "beverly", "zoning-minimap.json"), "w") as f:
        json.dump(
            {
                "_meta": {
                    "source": "MassGIS Level 3 assessor parcels, Beverly, " + vintage,
                    "notes": "Thumbnail outlines for the small maps. Projected in Massachusetts State "
                    "Plane (EPSG:26986), generalized to about 10 m, streets closed over. For "
                    "orientation only.",
                },
                "width": width,
                "height": height,
                "city": svg_path(city),
                "zones": thumbs,
            },
            f,
            separators=(",", ":"),
        )

    out_public = os.path.join(args.out_root, "public", "experiments", "beverly-zoning")
    os.makedirs(out_public, exist_ok=True)
    with open(os.path.join(out_public, "districts.geojson"), "w") as f:
        json.dump(
            {
                "type": "FeatureCollection",
                "_meta": {
                    "source": "MassGIS Level 3 assessor parcels, Beverly, " + vintage,
                    "url": SOURCE_URL,
                    "fiscalYear": fiscal_year,
                    "notes": "Parcels dissolved by the assessor's ZONING field (base districts only, "
                    "no overlays). Streets, railroad and water are not parcels and show as gaps. "
                    "An approximation of the City's zoning map, not a legal determination.",
                    "labelFields": ["zone", "lat", "lon", "minZoom"],
                },
                "labels": labels,
                "features": features,
            },
            f,
            separators=(",", ":"),
        )

    rows = sorted(addresses.values(), key=lambda a: a[0])
    with open(os.path.join(out_public, "addresses.json"), "w") as f:
        json.dump(
            {
                "_meta": {
                    "source": "MassGIS Level 3 assessor parcels, Beverly, " + vintage,
                    "fields": ["address", "zone", "lat", "lon", "lotSqft", "use"],
                    "notes": "One row per street address. lotSqft is the assessor's lot size "
                    "(or the mapped parcel when the assessor lists none), rounded to 10 sq ft. "
                    "For condominiums it is the whole shared lot.",
                },
                "rows": rows,
            },
            f,
            separators=(",", ":"),
        )

    total_zoned = sum(s["acres"] for s in stats.values())
    summary = {
        "_meta": {
            "title": "Beverly parcels by base zoning district",
            "source": "MassGIS Level 3 standardized assessor parcels, Beverly (town 30), " + vintage,
            "url": SOURCE_URL,
            "fiscalYear": fiscal_year,
            "confidence": "modeled",
            "retrieved": "2026-10",
            "notes": "Computed by scripts/beverly-zoning/build_zoning_data.py. Zone is the assessor's "
            "ZONING field (base district, no overlays); a parcel with records in more than one zone "
            "takes the most common. Acres are mapped parcel area, so streets, railroad and water "
            "are excluded. Uses are DOR use codes folded into categories; a parcel takes the most "
            "common category among its records. Single-family lot sizes use the assessor's lot "
            "size, or the mapped parcel when the assessor lists none.",
            "parcelsWithConflictingZones": conflicts,
        },
        "totals": {
            "parcels": sum(s["parcels"] for s in stats.values()),
            "assessorRecords": sum(s["records"] for s in stats.values()),
            "zonedAcres": round(total_zoned, 1),
            "streetAcres": round(other_area["ROW"] / M2_PER_ACRE + other_area["PRIV_ROW"] / M2_PER_ACRE, 1),
            "railAcres": round(other_area["RAIL_ROW"] / M2_PER_ACRE, 1),
            "waterAcres": round(other_area["WATER"] / M2_PER_ACRE, 1),
            "addresses": len(rows),
        },
        "districts": {},
    }
    for zone, s in sorted(stats.items(), key=lambda kv: -kv[1]["acres"]):
        lots = sorted(s["lots"])
        summary["districts"][zone] = {
            "parcels": s["parcels"],
            "assessorRecords": s["records"],
            "acres": round(s["acres"], 1),
            "shareOfZonedLand": round(100 * s["acres"] / total_zoned, 1),
            "uses": dict(s["uses"].most_common()),
            "singleFamilyLots": len(lots),
            "singleFamilyLotSqftMedian": int(round(statistics.median(lots), -1)) if lots else None,
            # Kept so lot-size conformity can be computed once each district's minimum is verified.
            "singleFamilyLotSqftDeciles": [int(round(lots[int(len(lots) * q / 10)], -1)) for q in range(1, 10)]
            if len(lots) >= 10
            else None,
        }

    with open(os.path.join(args.out_root, "data", "beverly", "zoning-parcels.json"), "w") as f:
        json.dump(summary, f, indent=2)
        f.write("\n")

    print(f"{len(features)} districts, {len(rows)} addresses, {conflicts} parcel(s) with conflicting zones")


if __name__ == "__main__":
    main()
