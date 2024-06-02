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
          singleMonitor: "Single Monitor",
          tripleMonitorAngle: "Triple Monitor Angle",
          angle: "angle",
          distanceToScreen: "Distance to Screen (cm)",
          screenSize: "Screen Size (inch)",
          inch: "inch",
          aspectRatio: "Aspect Ratio",
          verticalFov: "Vertical FOV",
          horizontalFov: "Horizontal FOV",
          richardburnsrally: "Richard Burns Rally",
          f120162018: "F1 2016-2018",
          f120192020: "F1 2019-2020",
          f12021: "F1 2021+",
          dirtrally: "Dirt Rally",
          gtr2: "GTR2",
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
          richardburnsrally: "理查德伯恩斯拉力赛",
          f120162018: "F1 2016-2018",
          f120192020: "F1 2019-2020",
          f12021: "F1 2021+",
          dirtrally: "尘埃拉力系列",
          gtr2: "GTR2,Race07",
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
