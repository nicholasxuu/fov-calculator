import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { GameList } from "./games";

interface GameTranslation {
  en: string;
  cn: string;
}

// 将 GameList 转换为 i18n 格式
const gameTranslations = Object.entries(GameList).reduce((acc, [key, value]) => {
  return {
    ...acc,
    [`game_${key}`]: {
      en: value.en,
      cn: value.cn,
    },
  };
}, {} as Record<string, GameTranslation>);

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: {
        translation: {
          curvature: "Curvature",
          flat: "Flat",
          tripleMonitor: "Triple Monitor",
          singleMonitor: "Single Monitor",
          tripleMonitorAngle: "Triple Monitor Angle",
          angle: "angle",
          distanceToScreen: "Distance to Screen (cm)",
          screenSize: "Screen Size (inch)",
          inch: "inch",
          aspectRatio: "Aspect Ratio",
          verticalFov: "Vertical FOV",
          horizontalFov: "Horizontal FOV",
          export_canvas: "Export",
          custom: "Custom",
          back: "Back",
          search_games: "Search games...",
          ...Object.entries(gameTranslations).reduce((acc, [key, value]) => {
            return { ...acc, [key]: value.en };
          }, {}),
        },
      },
      cn: {
        translation: {
          curvature: "屏幕曲率",
          flat: "平面屏",
          tripleMonitor: "三屏",
          singleMonitor: "单屏",
          tripleMonitorAngle: "三屏角度",
          angle: "夹角",
          distanceToScreen: "眼睛与屏幕距离 (厘米)",
          screenSize: "屏幕尺寸 (英寸)",
          inch: "英寸",
          aspectRatio: "屏幕比例",
          verticalFov: "纵向角度",
          horizontalFov: "横向角度",
          export_canvas: "导出",
          custom: "自定义",
          back: "返回",
          search_games: "搜索游戏...",
          ...Object.entries(gameTranslations).reduce((acc, [key, value]) => {
            return { ...acc, [key]: value.cn };
          }, {}),
        },
      },
    },
    lng: "cn", // if you're using a language detector, do not define the lng option
    fallbackLng: "en",

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

export default i18n;
