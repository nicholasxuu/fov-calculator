import i18n from "i18next";
import { initReactI18next } from "react-i18next";

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
          tripleMonitorAngle: "Triple Monitor Angle",
          distanceToScreen: "Distance to Screen (cm)",
          screenSize: "Screen Size (inch)",
          aspectRatio: "Aspect Ratio",
        },
      },
      cn: {
        translation: {
          curvature: "屏幕曲率",
          flat: "平面屏",
          tripleMonitor: "三屏",
          tripleMonitorAngle: "三屏角度",
          distanceToScreen: "眼睛与屏幕距离 (厘米)",
          screenSize: "屏幕尺寸 (英寸)",
          aspectRatio: "屏幕比例",
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
