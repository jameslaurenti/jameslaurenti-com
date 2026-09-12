/**
 * Classifier for BevScan incidents -> vehicle property-crime records.
 *
 * BevScan's category vocabulary is coarse (13 values, none vehicle-specific),
 * so incident type is inferred from text. That inference is lossy and the map
 * says so. Keep every rule here, not spread through the fetch script.
 */

// Categories that can plausibly carry a vehicle property crime. Everything
// else in BevScan's vocabulary (medical, domestic, wellbeing_check,
// traffic_stop, fire_alarm, admin, assist, mva) is excluded outright.
export const ALLOWED_CATEGORIES = new Set(["theft", "suspicious", "other"]);

// "Car 2" and "Engine 3" are fire apparatus call signs, not vehicles.
// Stripping them first prevents a fire alarm from reading as a car break-in.
const UNIT_CALLSIGN = /\b(car|engine|ladder|unit|tango|sierra|delta|india|squad|tower|rescue)[\s-]*\d+\b/gi;

// Word boundaries on the whole alternation: without them "car" matches inside
// "credit card" and a card larceny reads as a vehicle break-in.
const bounded = (terms) => new RegExp(String.raw`\b(?:${terms.join("|")})\b`, "i");

const VEHICLE = bounded([
  "motor vehicles?", "vehicles?", "mv", "cars?", "trucks?", "vans?",
  "suv", "sedans?", "pick-?ups?", "automobiles?",
  "catalytic converters?", "windshields?", "license plates?",
  "glove ?box", "parked",
]);

const CRIME = bounded([
  "break-?ins?", "broke into", "broken into", "breaking and entering",
  "b ?& ?e", "larcen(?:y|ies)", "theft", "stolen", "stole", "steal",
  "rummag\w*", "ransack\w*", "smashed", "vandal\w*", "keyed",
  "was entered", "were entered", "entry",
]);

const ATTEMPT = bounded([
  "attempt\w*", "tried to", "trying to", "suspicious", "checking (?:the )?doors?",
  "door checks?", "door handles?", "casing", "without success", "unsuccessful",
  "appearing to search", "looking into",
]);

// Hard excludes: a crash, a stop, or a wanted vehicle is a different fact from
// a break-in and must not be flattened into the same map.
const NOT_PROPERTY_CRIME = bounded([
  "crash", "collision", "mvc", "accident", "rear-?ended", "hit and run",
  "motor vehicle stop", "traffic stop", "disabled (?:motor )?vehicle",
  "tow(?:ed|ing)? (?:for|due)", "parking (?:complaint|violation)", "road ?rage",
  "attempt to locate", "bolo", "repossess\w*",
  "off (?:the )?road", "into a ditch", "struck a", "rollover",
]);

const clean = (s) => String(s || "").replace(UNIT_CALLSIGN, " ");

/**
 * @returns {{kind: 'confirmed'|'suspicious', label: string} | null}
 *   null when the record is not a vehicle property crime.
 */
export function classify(incident) {
  if (!ALLOWED_CATEGORIES.has(incident.category)) return null;

  const title = clean(incident.title);
  const body = clean([incident.summary, incident.snippet].filter(Boolean).join(" "));
  const text = `${title} ${body}`;

  if (NOT_PROPERTY_CRIME.test(text)) return null;
  if (!VEHICLE.test(text)) return null;

  const hasCrime = CRIME.test(text);
  const hasAttempt = ATTEMPT.test(text);
  if (!hasCrime && !hasAttempt) return null;

  // An attempt, a door check, or anything BevScan filed as `suspicious` is a
  // call about behaviour. Only a reported entry or theft is `confirmed`, and
  // "confirmed" means confirmed as a report, not as a prosecuted crime.
  const kind =
    hasCrime && !hasAttempt && incident.category === "theft" ? "confirmed" : "suspicious";

  return { kind, label: labelFor(kind, text) };
}

// Neutral labels from a controlled vocabulary. BevScan summary text is never
// republished: it carries suspect descriptions, including race and clothing.
function labelFor(kind, text) {
  if (kind === "confirmed") {
    if (/catalytic converter/i.test(text)) return "Catalytic converter theft reported";
    if (/vehicle (?:was )?stolen|stolen (?:motor )?vehicle/i.test(text))
      return "Vehicle theft reported";
    if (/vandal|smashed|windshield|keyed/i.test(text)) return "Vehicle damage reported";
    return "Vehicle break-in reported";
  }
  if (/door checks?|checking (?:the )?doors?|door handles?/i.test(text))
    return "Car doors checked, suspicious activity call";
  if (/attempt/i.test(text)) return "Attempted vehicle entry, suspicious activity call";
  return "Suspicious activity near a vehicle";
}
