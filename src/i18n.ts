import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { GameList } from "./games";

i18n.use(initReactI18next).init({
  resources: {
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
        custom: "自定义",
        back: "返回",
        search_games: "搜索游戏...",
        gt7CockpitMode: "GT7车内视角模式",
        specialMode: "特殊模式",
        enabled: "已启用",
        disabled: "已禁用",
        autoAdjusted: "自动调整",
        resolution: "屏幕分辨率",
        ppd: "PPD",
        resolutionForPpd: "用于计算清晰度 PPD",
        minPpdMode: "最低PPD模式",
        limitedByMinPpd: "受最低PPD限制",
        ppdHint: "PPD（每度像素数）= 一度视角内有多少像素，衡量清晰度。\n约 20：VR 头显水平（Steam Frame：2160 像素覆盖 110°），像素感明显\n30–40：正常坐姿下基本看不出像素\n60：视网膜级别，人眼约能分辨 1 角分",
        settings: "设定",
        ...Object.entries(GameList).reduce((acc, [key, value]) => {
          return { ...acc, [`game_${key}`]: value.cn };
        }, {}),
      },
    },
  },
  lng: "cn",
  supportedLngs: ["cn"],
  fallbackLng: "cn",
  interpolation: { escapeValue: false },
});

export default i18n;
