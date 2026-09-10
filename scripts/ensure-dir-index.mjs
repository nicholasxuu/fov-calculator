// next export writes each route as "<route>.html", which relies on the host
// falling back from "/guide/game-fov-settings" to "game-fov-settings.html".
// GitHub Pages does that, but other static hosts resolve directory indexes
// first and 404 instead. Mirroring every exported page to "<route>/index.html"
// makes both resolution orders serve the same document, so the guide URLs work
// wherever the site is deployed. The canonical tag in each page still points at
// the extensionless form, so the duplicate is invisible to search engines.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "out");

// Next already emits out/index.html and out/404.html at the root; mirroring
// those would create a nonsensical out/index/index.html.
const SKIP = new Set(["index.html", "404.html"]);

let mirrored = 0;

const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(full);
      continue;
    }

    if (!entry.name.endsWith(".html") || SKIP.has(entry.name)) continue;

    const asDir = full.slice(0, -".html".length);
    const target = path.join(asDir, "index.html");
    if (fs.existsSync(target)) continue;

    fs.mkdirSync(asDir, { recursive: true });
    fs.copyFileSync(full, target);
    mirrored += 1;
  }
};

if (fs.existsSync(OUT)) {
  walk(OUT);
  console.log(`dir-index: mirrored ${mirrored} pages`);
}
