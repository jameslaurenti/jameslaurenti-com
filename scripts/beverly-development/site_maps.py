"""Draw a small parcel map for every site in data/beverly/development-register.json.

Each map shows the site's parcels shaded, the neighboring lots outlined and the streets filled, north up, with a
scale bar. Geometry comes from the City of Beverly GIS (Combined_gdb: layer 5 Parcels, layer 83 street
polygons), requested politely and cached, with no owner fields. Output: public/beverly/development/maps/<id>.svg

Run from the repo root:  python -I scripts/beverly-development/site_maps.py [--refresh] [site-id ...]
"""
import json
import math
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REGISTER = ROOT / "data/beverly/development-register.json"
OUT = ROOT / "public/beverly/development/maps"
CACHE = Path(__file__).resolve().parent / "cache"
BASE = "https://services1.arcgis.com/IVwtHDf2UjOF6PcX/arcgis/rest/services/Combined_gdb/FeatureServer"
UA = "beverly-development-register/0.1 (civic research for jameslaurenti.com; polite)"
SR = 26986  # Massachusetts State Plane, meters
W, PAD = 640, 18

args = [a for a in sys.argv[1:] if not a.startswith("--")]
refresh = "--refresh" in sys.argv
last_request = [0.0]


def query(layer, params, cache_name):
    path = CACHE / cache_name
    if path.exists() and not refresh:
        return json.loads(path.read_text(encoding="utf-8"))
    wait = 3 - (time.time() - last_request[0])
    if wait > 0:
        time.sleep(wait)
    data = urllib.parse.urlencode({**params, "outSR": SR, "f": "json"}).encode()
    req = urllib.request.Request(f"{BASE}/{layer}/query", data=data, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=90) as r:
        result = json.load(r)
    last_request[0] = time.time()
    if "error" in result:
        raise SystemExit(f"GIS error for {cache_name}: {result['error']}")
    CACHE.mkdir(exist_ok=True)
    path.write_text(json.dumps(result), encoding="utf-8")
    return result


def rings(feature):
    return feature.get("geometry", {}).get("rings", [])


def main():
    reg = json.loads(REGISTER.read_text(encoding="utf-8"))
    sites = [s for s in reg["sites"] if not args or s["id"] in args]
    ids = sorted({p for s in sites for p in s["parcels"]})
    where = "MAP_PAR_ID IN (" + ",".join("'" + p.replace("'", "''") + "'" for p in ids) + ")"
    own = query(5, {"where": where, "outFields": "MAP_PAR_ID", "returnGeometry": "true"}, "site-parcels.json")
    by_id = {}
    for f in own["features"]:
        by_id.setdefault(f["attributes"]["MAP_PAR_ID"], []).append(f)
    OUT.mkdir(parents=True, exist_ok=True)

    for site in sites:
        mine = [f for p in site["parcels"] for f in by_id.get(p, [])]
        pts = [pt for f in mine for ring in rings(f) for pt in ring]
        if not pts:
            print(f"{site['id']}: no parcel geometry, skipped")
            continue
        xs, ys = [p[0] for p in pts], [p[1] for p in pts]
        span = max(max(xs) - min(xs), max(ys) - min(ys))
        margin = max(span * 0.45, 90)
        x0, x1, y0, y1 = min(xs) - margin, max(xs) + margin, min(ys) - margin, max(ys) + margin
        # Keep the frame between 4:3 and 1:1.
        if (y1 - y0) < (x1 - x0) * 0.75:
            extra = (x1 - x0) * 0.75 - (y1 - y0)
            y0, y1 = y0 - extra / 2, y1 + extra / 2
        if (y1 - y0) > (x1 - x0):
            extra = (y1 - y0) - (x1 - x0)
            x0, x1 = x0 - extra / 2, x1 + extra / 2
        env = {"geometry": json.dumps({"xmin": x0, "ymin": y0, "xmax": x1, "ymax": y1, "spatialReference": {"wkid": SR}}),
               "geometryType": "esriGeometryEnvelope", "inSR": SR, "spatialRel": "esriSpatialRelIntersects",
               "returnGeometry": "true"}
        near = query(5, {**env, "where": "1=1", "outFields": "MAP_PAR_ID"}, f"{site['id']}-parcels.json")
        streets = query(83, {**env, "where": "1=1", "outFields": "OBJECTID"}, f"{site['id']}-streets.json")

        scale = (W - 2 * PAD) / (x1 - x0)
        H = round((y1 - y0) * scale + 2 * PAD)

        def path_d(feature):
            parts = []
            for ring in rings(feature):
                pts = " L".join(f"{PAD + (x - x0) * scale:.1f},{H - PAD - (y - y0) * scale:.1f}" for x, y in ring)
                parts.append(f"M{pts}Z")
            return " ".join(parts)

        own_ids = set(site["parcels"])
        svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" '
               f'aria-label="Parcel map of {site["name"]}">',
               f'<rect width="{W}" height="{H}" fill="#f0ede8"/>',
               f'<clipPath id="frame"><rect x="{PAD}" y="{PAD}" width="{W - 2 * PAD}" height="{H - 2 * PAD}"/></clipPath>',
               '<g clip-path="url(#frame)">']
        for f in streets["features"]:
            svg.append(f'<path d="{path_d(f)}" fill="#ddd6cb" fill-rule="evenodd" stroke="none"/>')
        for f in near["features"]:
            if f["attributes"]["MAP_PAR_ID"] not in own_ids:
                svg.append(f'<path d="{path_d(f)}" fill="none" stroke="#b9b1a5" stroke-width="0.7"/>')
        for f in mine:
            svg.append(f'<path d="{path_d(f)}" fill="#2d6a4f" fill-opacity="0.25" fill-rule="evenodd" stroke="#2d6a4f" stroke-width="2.2"/>')
        svg.append("</g>")
        # Scale bar: a round length near a fifth of the frame.
        target = (x1 - x0) / 5
        nice = min((n for n in (25, 50, 100, 200, 250, 500, 1000) if n >= target * 0.6), default=1000)
        bx, by = PAD + 10, H - PAD - 12
        svg.append(f'<rect x="{bx - 6}" y="{by - 16}" width="{nice * scale + 64}" height="26" fill="#f0ede8" fill-opacity="0.85"/>')
        svg.append(f'<line x1="{bx}" y1="{by}" x2="{bx + nice * scale:.1f}" y2="{by}" stroke="#4d4840" stroke-width="2"/>')
        svg.append(f'<text x="{bx + nice * scale + 6:.1f}" y="{by + 4}" font-family="sans-serif" font-size="12" fill="#4d4840">{nice} m</text>')
        # North arrow.
        nx, ny = W - PAD - 16, PAD + 12
        svg.append(f'<path d="M{nx},{ny} L{nx - 6},{ny + 16} L{nx},{ny + 12} L{nx + 6},{ny + 16} Z" fill="#4d4840"/>')
        svg.append(f'<text x="{nx}" y="{ny + 30}" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#4d4840">N</text>')
        svg.append("</svg>")
        (OUT / f"{site['id']}.svg").write_text("\n".join(svg), encoding="utf-8")
        print(f"{site['id']}: {len(mine)} parcel(s), {len(near['features'])} nearby, {len(streets['features'])} street pieces, {W}x{H}")


if __name__ == "__main__":
    main()
