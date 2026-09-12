#!/usr/bin/env node
/**
 * Copy MapLibre's worker bundle into public/ so the map can load it.
 *
 * MapLibre resolves its own worker with `new URL('./maplibre-gl-worker.mjs',
 * import.meta.url)`. Under Next's bundler `import.meta.url` points at a hashed
 * chunk in /_next/static/chunks/, where that file does not exist, so the
 * request falls through to the HTML 404 page and the browser rejects it:
 *
 *   Failed to load module script: The server responded with a non-JavaScript
 *   MIME type of "text/html".
 *
 * The map then renders no tiles at all, silently, because style and sprites
 * load on the main thread and only tile work happens in the worker.
 *
 * The fix is to serve the worker ourselves and point MapLibre at it with
 * setWorkerUrl(). The worker imports ./maplibre-gl-shared.mjs by relative path,
 * so both files have to land in the same directory.
 *
 * Runs from `predev` and `prebuild`, so the copies track the installed version
 * and cannot drift after an upgrade.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FROM = path.join(REPO, "node_modules/maplibre-gl/dist");
const TO = path.join(REPO, "public/vendor/maplibre");

const FILES = ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"];

fs.mkdirSync(TO, { recursive: true });

let copied = 0;
for (const file of FILES) {
  const src = path.join(FROM, file);
  if (!fs.existsSync(src)) {
    console.error(`copy-maplibre-worker: ${file} not found in maplibre-gl/dist.`);
    console.error("The map will render no tiles. Check the installed maplibre-gl version.");
    process.exit(1);
  }
  const dest = path.join(TO, file);
  const next = fs.readFileSync(src);
  const same = fs.existsSync(dest) && Buffer.compare(fs.readFileSync(dest), next) === 0;
  if (!same) {
    fs.writeFileSync(dest, next);
    copied++;
  }
}

console.log(
  copied
    ? `copy-maplibre-worker: refreshed ${copied} file(s) in public/vendor/maplibre`
    : "copy-maplibre-worker: public/vendor/maplibre already current",
);
