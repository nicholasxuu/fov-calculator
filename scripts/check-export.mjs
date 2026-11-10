import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const out = fileURLToPath(new URL("../out/", import.meta.url));
const html = readFileSync(path.join(out, "index.html"), "utf8");

test("calculator scripts and styles resolve inside an uploaded subdirectory", () => {
  const base = new URL("https://example.com/toy/preview/demo/index.html");
  const assets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1]).filter((url) => url.includes("_next/"));
  assert.ok(assets.length > 0, "export must include calculator scripts and styles");
  for (const asset of assets) {
    const url = new URL(asset, base);
    assert.ok(url.pathname.startsWith("/toy/preview/demo/"), `Escapes upload directory: ${asset}`);
    assert.ok(existsSync(path.join(out, url.pathname.slice("/toy/preview/demo/".length))), `Missing asset: ${asset}`);
  }
});

test("toy export contains no guide pages or guide links", () => {
  assert.ok(!readdirSync(out).some((name) => /^(guide|zh)(\.|$)/.test(name)), "guide routes must not be exported");
  assert.doesNotMatch(html, /href="[^"]*\/guide(?:[\/"])/);
});
