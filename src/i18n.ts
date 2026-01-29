import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { GameList } from "./games";

interface GameTranslation {
  en: string;
  cn: string;
  it?: string;
  de?: string;
  es?: string;
  fr?: string;
  ja?: string;
}

// 将 GameList 转换为 i18n 格式
const gameTranslations = Object.entries(GameList).reduce(
  (acc, [key, value]) => {
    return {
      ...acc,
      [`game_${key}`]: {
        en: value.en,
        cn: value.cn,
      },
    };
  },
  {} as Record<string, GameTranslation>,
);

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
          gt7CockpitMode: "GT7 Cockpit View Mode",
          specialMode: "Special Mode",
          enabled: "Enabled",
          disabled: "Disabled",
          autoAdjusted: "Auto-adjusted",
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
          gt7CockpitMode: "GT7车内视角模式",
          specialMode: "特殊模式",
          enabled: "已启用",
          disabled: "已禁用",
          autoAdjusted: "自动调整",
          ...Object.entries(gameTranslations).reduce((acc, [key, value]) => {
            return { ...acc, [key]: value.cn };
          }, {}),
        },
      },
      it: {
        translation: {
          curvature: "Curvatura",
          flat: "Piatto",
          tripleMonitor: "Triplo Monitor",
          singleMonitor: "Monitor Singolo",
          tripleMonitorAngle: "Angolo Triplo Monitor",
          angle: "angolo",
          distanceToScreen: "Distanza dallo Schermo (cm)",
          screenSize: "Dimensione Schermo (pollici)",
          inch: "pollici",
          aspectRatio: "Rapporto d'Aspetto",
          verticalFov: "FOV Verticale",
          horizontalFov: "FOV Orizzontale",
          export_canvas: "Esporta",
          custom: "Personalizzato",
          back: "Indietro",
          search_games: "Cerca giochi...",
          gt7CockpitMode: "Modalità Abitacolo GT7",
          specialMode: "Modalità Speciale",
          enabled: "Abilitato",
          disabled: "Disabilitato",
          autoAdjusted: "Regolato automaticamente",
          ...Object.entries(gameTranslations).reduce((acc, [key, value]) => {
            return { ...acc, [key]: value.en };
          }, {}),
        },
      },
      de: {
        translation: {
          curvature: "Krümmung",
          flat: "Flach",
          tripleMonitor: "Dreifach-Monitor",
          singleMonitor: "Einzelmonitor",
          tripleMonitorAngle: "Dreifach-Monitor-Winkel",
          angle: "Winkel",
          distanceToScreen: "Abstand zum Bildschirm (cm)",
          screenSize: "Bildschirmgröße (Zoll)",
          inch: "Zoll",
          aspectRatio: "Seitenverhältnis",
          verticalFov: "Vertikales FOV",
          horizontalFov: "Horizontales FOV",
          export_canvas: "Exportieren",
          custom: "Benutzerdefiniert",
          back: "Zurück",
          search_games: "Spiele suchen...",
          gt7CockpitMode: "GT7 Cockpit-Ansichtsmodus",
          specialMode: "Spezialmodus",
          enabled: "Aktiviert",
          disabled: "Deaktiviert",
          autoAdjusted: "Automatisch angepasst",
          ...Object.entries(gameTranslations).reduce((acc, [key, value]) => {
            return { ...acc, [key]: value.en };
          }, {}),
        },
      },
      es: {
        translation: {
          curvature: "Curvatura",
          flat: "Plano",
          tripleMonitor: "Triple Monitor",
          singleMonitor: "Monitor Individual",
          tripleMonitorAngle: "Ángulo de Triple Monitor",
          angle: "ángulo",
          distanceToScreen: "Distancia a la Pantalla (cm)",
          screenSize: "Tamaño de Pantalla (pulgadas)",
          inch: "pulgadas",
          aspectRatio: "Relación de Aspecto",
          verticalFov: "FOV Vertical",
          horizontalFov: "FOV Horizontal",
          export_canvas: "Exportar",
          custom: "Personalizado",
          back: "Volver",
          search_games: "Buscar juegos...",
          gt7CockpitMode: "Modo Vista Cabina GT7",
          specialMode: "Modo Especial",
          enabled: "Habilitado",
          disabled: "Deshabilitado",
          autoAdjusted: "Ajustado automáticamente",
          ...Object.entries(gameTranslations).reduce((acc, [key, value]) => {
            return { ...acc, [key]: value.en };
          }, {}),
        },
      },
      fr: {
        translation: {
          curvature: "Courbure",
          flat: "Plat",
          tripleMonitor: "Triple Moniteur",
          singleMonitor: "Moniteur Simple",
          tripleMonitorAngle: "Angle Triple Moniteur",
          angle: "angle",
          distanceToScreen: "Distance à l'Écran (cm)",
          screenSize: "Taille de l'Écran (pouces)",
          inch: "pouces",
          aspectRatio: "Rapport d'Aspect",
          verticalFov: "FOV Vertical",
          horizontalFov: "FOV Horizontal",
          export_canvas: "Exporter",
          custom: "Personnalisé",
          back: "Retour",
          search_games: "Rechercher des jeux...",
          gt7CockpitMode: "Mode Vue Cockpit GT7",
          specialMode: "Mode Spécial",
          enabled: "Activé",
          disabled: "Désactivé",
          autoAdjusted: "Ajusté automatiquement",
          ...Object.entries(gameTranslations).reduce((acc, [key, value]) => {
            return { ...acc, [key]: value.en };
          }, {}),
        },
      },
      ja: {
        translation: {
          curvature: "曲率",
          flat: "平面",
          tripleMonitor: "トリプルモニター",
          singleMonitor: "シングルモニター",
          tripleMonitorAngle: "トリプルモニター角度",
          angle: "角度",
          distanceToScreen: "画面までの距離 (cm)",
          screenSize: "画面サイズ (インチ)",
          inch: "インチ",
          aspectRatio: "アスペクト比",
          verticalFov: "垂直FOV",
          horizontalFov: "水平FOV",
          export_canvas: "エクスポート",
          custom: "カスタム",
          back: "戻る",
          search_games: "ゲームを検索...",
          gt7CockpitMode: "GT7コックピットビューモード",
          specialMode: "特殊モード",
          enabled: "有効",
          disabled: "無効",
          autoAdjusted: "自動調整",
          ...Object.entries(gameTranslations).reduce((acc, [key, value]) => {
            return { ...acc, [key]: value.en };
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
