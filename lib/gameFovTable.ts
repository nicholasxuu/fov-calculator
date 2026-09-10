// Build-time only. Generates the per-game FOV reference tables from the same
// GameList the calculator ships, so game names, units and decimal places can
// never drift away from the app.
//
// The numeric transforms below MIRROR the switch in pages/index.tsx
// (search for `case "cmf1-16-18"`). The constants are duplicated rather than
// imported because pulling them out of index.tsx would reshape the calculator's
// client bundle, which this feature is required not to touch. If you change a
// transform in index.tsx, change it here too.
import { GameList } from "../src/games";
import type { GuideLocale } from "./guide";

const D2R = Math.PI / 180;

const CMF1_BASE_ANGLE = 77;
const CMF1 = {
  "cmf1-16-18": { scale: 0.05, min: -1, max: 1 },
  "cmf1-19-20": { scale: 0.1, min: -10, max: 10 },
  "cmf1-21": { scale: 1, min: -20, max: 20 },
} as const;
const GTR2 = { divisor: 58, min: 0.5, max: 1.5 };
const RACE07 = { divisor: 58, min: 0.4, max: 1.5 };
const DIRT = { min: 30, max: 70, step: 5 };

export type GameType = string;

/** Reproduces one game's field value from the horizontal/vertical angles. */
export const gameFovValue = (type: GameType, hFov: number, vFov: number, digits: number): string => {
  const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

  switch (type) {
    case "cmf1-16-18":
    case "cmf1-19-20":
    case "cmf1-21": {
      const c = CMF1[type as keyof typeof CMF1];
      return clamp(((hFov - CMF1_BASE_ANGLE) / 2) * c.scale, c.min, c.max).toFixed(digits);
    }
    case "hfov-rad":
      return (vFov * D2R).toFixed(digits);
    case "hfov-deg":
      return hFov.toFixed(digits);
    case "vfov-deg":
      return vFov.toFixed(digits);
    case "vfov-degx2":
      return (vFov * 2).toFixed(digits);
    case "vfov-gtr2":
      return clamp(vFov / GTR2.divisor, GTR2.min, GTR2.max).toFixed(digits);
    case "vfov-race07":
      return clamp(vFov / RACE07.divisor, RACE07.min, RACE07.max).toFixed(digits);
    case "vfov-dirtrally":
      return String(Math.ceil((clamp(vFov, DIRT.min, DIRT.max) - DIRT.min) / DIRT.step));
    default:
      return "";
  }
};

const FORMULA: Record<string, { en: string; zh: string }> = {
  "cmf1-16-18": {
    en: "clamp((HFOV − 77) ÷ 2 × 0.05, −1, 1)",
    zh: "clamp((HFOV − 77) ÷ 2 × 0.05, −1, 1)",
  },
  "cmf1-19-20": {
    en: "clamp((HFOV − 77) ÷ 2 × 0.1, −10, 10)",
    zh: "clamp((HFOV − 77) ÷ 2 × 0.1, −10, 10)",
  },
  "cmf1-21": {
    en: "clamp((HFOV − 77) ÷ 2, −20, 20)",
    zh: "clamp((HFOV − 77) ÷ 2, −20, 20)",
  },
  "hfov-rad": { en: "VFOV in radians", zh: "垂直 FOV 的弧度值" },
  "hfov-deg": { en: "HFOV in degrees", zh: "水平 FOV 角度值" },
  "vfov-deg": { en: "VFOV in degrees", zh: "垂直 FOV 角度值" },
  "vfov-degx2": { en: "VFOV × 2", zh: "垂直 FOV × 2" },
  "vfov-gtr2": { en: "clamp(VFOV ÷ 58, 0.5, 1.5)", zh: "clamp(VFOV ÷ 58, 0.5, 1.5)" },
  "vfov-race07": { en: "clamp(VFOV ÷ 58, 0.4, 1.5)", zh: "clamp(VFOV ÷ 58, 0.4, 1.5)" },
  "vfov-dirtrally": {
    en: "ceil((clamp(VFOV, 30, 70) − 30) ÷ 5) — a slider notch, not an angle",
    zh: "ceil((clamp(VFOV, 30, 70) − 30) ÷ 5)——档位序号，不是角度",
  },
};

const INPUT_LABEL: Record<string, { en: string; zh: string }> = {
  "cmf1-16-18": { en: "Horizontal", zh: "水平" },
  "cmf1-19-20": { en: "Horizontal", zh: "水平" },
  "cmf1-21": { en: "Horizontal", zh: "水平" },
  "hfov-rad": { en: "Vertical", zh: "垂直" },
  "hfov-deg": { en: "Horizontal", zh: "水平" },
  "vfov-deg": { en: "Vertical", zh: "垂直" },
  "vfov-degx2": { en: "Vertical", zh: "垂直" },
  "vfov-gtr2": { en: "Vertical", zh: "垂直" },
  "vfov-race07": { en: "Vertical", zh: "垂直" },
  "vfov-dirtrally": { en: "Vertical", zh: "垂直" },
};

const HEADERS = {
  en: ["Game", "Reads", "Unit", "Value the calculator gives", "Formula"],
  zh: ["游戏", "读取", "单位", "计算器给出的值", "换算公式"],
};

const escapeCell = (value: string) => value.replace(/\|/g, "\\|");

/** Markdown table: every supported game, its formula, and the value produced by
 *  the worked example that the surrounding article sets up. */
export const renderGameTable = (locale: GuideLocale, hFov: number, vFov: number): string => {
  const rows = Object.values(GameList).map((game) => {
    const name = locale === "zh" ? game.cn : game.en;
    const value = gameFovValue(game.type, hFov, vFov, game.digits);
    const unit = game.unit === "" ? (locale === "zh" ? "无单位" : "unitless") : game.unit;
    return [
      escapeCell(name),
      INPUT_LABEL[game.type]?.[locale] ?? "",
      escapeCell(unit),
      `**${value}**`,
      escapeCell(FORMULA[game.type]?.[locale] ?? ""),
    ];
  });

  const head = HEADERS[locale];
  return [
    `| ${head.join(" | ")} |`,
    `| ${head.map(() => "---").join(" | ")} |`,
    ...rows.map((cells) => `| ${cells.join(" | ")} |`),
  ].join("\n");
};

export const gameCount = (): number => Object.keys(GameList).length;
