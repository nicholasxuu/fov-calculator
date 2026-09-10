// Regenerates public/sitemap.xml from the guide content on disk.
// Runs as `prebuild`, so the sitemap can never fall behind the pages that exist.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "content", "guide");
const OUT = path.join(ROOT, "public", "sitemap.xml");
const SITE = "https://fovcalc.xusf.xyz";

const HOME_LANGS = [
  ["x-default", `${SITE}/`],
  ["en", `${SITE}/?lang=en`],
  ["zh-CN", `${SITE}/?lang=cn`],
  ["it", `${SITE}/?lang=it`],
  ["de", `${SITE}/?lang=de`],
  ["es", `${SITE}/?lang=es`],
  ["fr", `${SITE}/?lang=fr`],
  ["ja", `${SITE}/?lang=ja`],
];

const today = () => new Date().toISOString().slice(0, 10);

const slugsFor = (locale) => {
  const suffix = `.${locale}.md`;
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((name) => name.endsWith(suffix))
    .map((name) => name.slice(0, -suffix.length));
};

const guidePath = (locale, slug) => {
  const base = locale === "zh" ? "/zh/guide" : "/guide";
  return slug ? `${base}/${slug}` : base;
};

const readUpdated = (slug, locale) => {
  const file = path.join(CONTENT_DIR, `${slug}.${locale}.md`);
  const { data } = matter(fs.readFileSync(file, "utf8"));
  return typeof data.updated === "string" && data.updated ? data.updated : today();
};

const xmlEscape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const urlEntry = ({ loc, lastmod, changefreq, priority, alternates }) =>
  [
    "  <url>",
    `    <loc>${xmlEscape(loc)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    ...alternates.map(
      ([hreflang, href]) =>
        `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${xmlEscape(href)}"/>`,
    ),
    "  </url>",
  ].join("\n");

const enSlugs = slugsFor("en");
const zhSlugs = slugsFor("zh");

// Only slugs present in both languages get hreflang alternates pointing at each
// other; a single-language article just links to itself as x-default.
const alternatesFor = (slug) => {
  const pairs = [];
  if (enSlugs.includes(slug)) pairs.push(["en", `${SITE}${guidePath("en", slug)}`]);
  if (zhSlugs.includes(slug)) pairs.push(["zh-CN", `${SITE}${guidePath("zh", slug)}`]);
  const fallback = enSlugs.includes(slug) ? "en" : "zh";
  pairs.push(["x-default", `${SITE}${guidePath(fallback, slug)}`]);
  return pairs;
};

const entries = [
  urlEntry({
    loc: `${SITE}/`,
    lastmod: today(),
    changefreq: "monthly",
    priority: "1.0",
    alternates: HOME_LANGS,
  }),
];

for (const locale of ["en", "zh"]) {
  const slugs = locale === "en" ? enSlugs : zhSlugs;
  if (!slugs.length) continue;

  entries.push(
    urlEntry({
      loc: `${SITE}${guidePath(locale)}`,
      lastmod: today(),
      changefreq: "monthly",
      priority: "0.8",
      alternates: [
        ["en", `${SITE}${guidePath("en")}`],
        ["zh-CN", `${SITE}${guidePath("zh")}`],
        ["x-default", `${SITE}${guidePath("en")}`],
      ],
    }),
  );

  for (const slug of slugs.sort()) {
    entries.push(
      urlEntry({
        loc: `${SITE}${guidePath(locale, slug)}`,
        lastmod: readUpdated(slug, locale),
        changefreq: "monthly",
        priority: "0.7",
        alternates: alternatesFor(slug),
      }),
    );
  }
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...entries,
  "</urlset>",
  "",
].join("\n");

fs.writeFileSync(OUT, xml);
console.log(`sitemap: ${entries.length} urls -> ${path.relative(ROOT, OUT)}`);
