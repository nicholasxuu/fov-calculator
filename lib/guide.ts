// Build-time only. Everything in this module runs inside getStaticProps /
// getStaticPaths, so `fs`, `gray-matter` and `marked` are stripped from the
// client bundle entirely. Never import this from a React component body.
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { gameCount, renderGameTable } from "./gameFovTable";

export type GuideLocale = "en" | "zh";

export type GuideFaq = {
  q: string;
  a: string;
};

export type GuideMeta = {
  slug: string;
  title: string;
  description: string;
  /** 40-60 words. Rendered as the lead block AND as the JSON-LD answer, so the
   *  prose and the structured data can never drift apart. */
  directAnswer: string;
  updated: string;
  order: number;
  faq: GuideFaq[];
};

export type GuideHeading = {
  id: string;
  text: string;
  level: number;
};

export type GuideDoc = GuideMeta & {
  html: string;
  headings: GuideHeading[];
};

const CONTENT_DIR = path.join(process.cwd(), "content", "guide");

/** Expands build-time tokens in the markdown source.
 *
 *  {{GAME_TABLE:<hFov>:<vFov>}} renders the full per-game reference table for
 *  the worked example the article sets up, straight from src/games.ts, so the
 *  article cannot fall out of sync with the games the calculator supports.
 *  {{GAME_COUNT}} renders how many games that is. */
const expandTokens = (markdown: string, locale: GuideLocale): string =>
  markdown
    .replace(/\{\{GAME_TABLE:([\d.]+):([\d.]+)\}\}/g, (_m, h: string, v: string) =>
      renderGameTable(locale, Number(h), Number(v)),
    )
    .replace(/\{\{GAME_COUNT\}\}/g, () => String(gameCount()));

const slugifyHeading = (raw: string): string =>
  raw
    .replace(/<[^>]+>/g, "")
    .trim()
    .toLowerCase()
    // Keeps ASCII alphanumerics plus CJK so Chinese headings still get readable
    // anchors. Avoids the /u unicode-property flag, which this tsconfig's ES5
    // target rejects.
    .replace(/[^a-z0-9\u4e00-\u9fff\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60) || "section";

/** Injects stable ids into h2/h3 so AI answers and humans can deep-link a
 *  specific section, and collects them for the on-page table of contents. */
const addHeadingAnchors = (html: string): { html: string; headings: GuideHeading[] } => {
  const headings: GuideHeading[] = [];
  const seen = new Map<string, number>();

  const out = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_match, level: string, inner: string) => {
    const base = slugifyHeading(inner);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;

    headings.push({
      id,
      text: inner.replace(/<[^>]+>/g, "").trim(),
      level: Number(level),
    });

    return `<h${level} id="${id}">${inner}</h${level}>`;
  });

  return { html: out, headings };
};

export const listGuideSlugs = (locale: GuideLocale): string[] => {
  const suffix = `.${locale}.md`;
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((name) => name.endsWith(suffix))
    .map((name) => name.slice(0, -suffix.length))
    .sort();
};

const readDoc = (slug: string, locale: GuideLocale) => {
  const file = path.join(CONTENT_DIR, `${slug}.${locale}.md`);
  const raw = fs.readFileSync(file, "utf8");
  return matter(raw);
};

export const getGuideMeta = (slug: string, locale: GuideLocale): GuideMeta => {
  const { data } = readDoc(slug, locale);
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    directAnswer: String(data.directAnswer ?? ""),
    updated: String(data.updated ?? ""),
    order: Number(data.order ?? 99),
    faq: Array.isArray(data.faq) ? (data.faq as GuideFaq[]) : [],
  };
};

export const getGuideDoc = (slug: string, locale: GuideLocale): GuideDoc => {
  const { content } = readDoc(slug, locale);
  const meta = getGuideMeta(slug, locale);
  const rendered = marked.parse(expandTokens(content, locale), {
    async: false,
    gfm: true,
  }) as string;
  const { html, headings } = addHeadingAnchors(rendered);
  return { ...meta, html, headings };
};

export const getAllGuideMeta = (locale: GuideLocale): GuideMeta[] =>
  listGuideSlugs(locale)
    .map((slug) => getGuideMeta(slug, locale))
    .sort((a, b) => a.order - b.order);
