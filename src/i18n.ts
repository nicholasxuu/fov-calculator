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
          export_canvas: "Export Image",
          share: "Share Link",
          shareLinkCopied: "Share link copied",
          custom: "Custom",
          back: "Back",
          search_games: "Search games...",
          gt7CockpitMode: "GT7 Cockpit View Mode",
          specialMode: "Special Mode",
          enabled: "Enabled",
          disabled: "Disabled",
          autoAdjusted: "Auto-adjusted",
          resolution: "Resolution",
          ppd: "PPD",
          resolutionForPpd: "for PPD calculation",
          minPpdMode: "Minimum PPD Mode",
          limitedByMinPpd: "limited by min PPD",
          guides: "Guides",
          ppdHint: "PPD (pixels per degree) = how many pixels fall within one degree of your view, a measure of sharpness.\n~20: VR-headset level (Steam Frame: 2160 px across 110°), pixels clearly visible\n30-40: pixels stop being noticeable at a normal seating distance\n60: retina level, the eye resolves about 1 arcminute",
          settings: "Settings",
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
          export_canvas: "导出图片",
          share: "分享链接",
          shareLinkCopied: "分享链接已复制",
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
          guides: "教程",
          ppdHint: "PPD（每度像素数）= 一度视角内有多少像素，衡量清晰度。\n约 20：VR 头显水平（Steam Frame：2160 像素覆盖 110°），像素感明显\n30–40：正常坐姿下基本看不出像素\n60：视网膜级别，人眼约能分辨 1 角分",
          settings: "设定",
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
          export_canvas: "Esporta Immagine",
          share: "Condividi Link",
          shareLinkCopied: "Link di condivisione copiato",
          custom: "Personalizzato",
          back: "Indietro",
          search_games: "Cerca giochi...",
          gt7CockpitMode: "Modalità Abitacolo GT7",
          specialMode: "Modalità Speciale",
          enabled: "Abilitato",
          disabled: "Disabilitato",
          autoAdjusted: "Regolato automaticamente",
          resolution: "Risoluzione",
          ppd: "PPD",
          resolutionForPpd: "per il calcolo del PPD",
          minPpdMode: "Modalità PPD Minimo",
          limitedByMinPpd: "limitato dal PPD minimo",
          guides: "Guide",
          ppdHint: "PPD (pixel per grado) = quanti pixel rientrano in un grado di campo visivo, una misura della nitidezza.\n~20: livello dei visori VR (Steam Frame: 2160 px su 110°), pixel ben visibili\n30-40: i pixel non si notano più alla normale distanza di seduta\n60: livello retina, l'occhio distingue circa 1 minuto d'arco",
          settings: "Impostazioni",
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
          export_canvas: "Bild exportieren",
          share: "Link teilen",
          shareLinkCopied: "Freigabelink kopiert",
          custom: "Benutzerdefiniert",
          back: "Zurück",
          search_games: "Spiele suchen...",
          gt7CockpitMode: "GT7 Cockpit-Ansichtsmodus",
          specialMode: "Spezialmodus",
          enabled: "Aktiviert",
          disabled: "Deaktiviert",
          autoAdjusted: "Automatisch angepasst",
          resolution: "Auflösung",
          ppd: "PPD",
          resolutionForPpd: "für die PPD-Berechnung",
          minPpdMode: "Mindest-PPD-Modus",
          limitedByMinPpd: "durch Mindest-PPD begrenzt",
          guides: "Anleitungen",
          ppdHint: "PPD (Pixel pro Grad) = wie viele Pixel auf ein Grad des Sichtfelds entfallen, ein Maß für die Schärfe.\n~20: VR-Headset-Niveau (Steam Frame: 2160 px auf 110°), Pixel deutlich sichtbar\n30-40: Pixel fallen im normalen Sitzabstand nicht mehr auf\n60: Retina-Niveau, das Auge löst rund 1 Bogenminute auf",
          settings: "Einstellungen",
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
          export_canvas: "Exportar Imagen",
          share: "Compartir Enlace",
          shareLinkCopied: "Enlace para compartir copiado",
          custom: "Personalizado",
          back: "Volver",
          search_games: "Buscar juegos...",
          gt7CockpitMode: "Modo Vista Cabina GT7",
          specialMode: "Modo Especial",
          enabled: "Habilitado",
          disabled: "Deshabilitado",
          autoAdjusted: "Ajustado automáticamente",
          resolution: "Resolución",
          ppd: "PPD",
          resolutionForPpd: "para el cálculo del PPD",
          minPpdMode: "Modo PPD Mínimo",
          limitedByMinPpd: "limitado por el PPD mínimo",
          guides: "Guías",
          ppdHint: "PPD (píxeles por grado) = cuántos píxeles caben en un grado de campo visual, una medida de nitidez.\n~20: nivel de visores de RV (Steam Frame: 2160 px en 110°), píxeles claramente visibles\n30-40: los píxeles dejan de notarse a una distancia de asiento normal\n60: nivel retina, el ojo distingue alrededor de 1 minuto de arco",
          settings: "Ajustes",
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
          export_canvas: "Exporter l'image",
          share: "Partager le lien",
          shareLinkCopied: "Lien de partage copié",
          custom: "Personnalisé",
          back: "Retour",
          search_games: "Rechercher des jeux...",
          gt7CockpitMode: "Mode Vue Cockpit GT7",
          specialMode: "Mode Spécial",
          enabled: "Activé",
          disabled: "Désactivé",
          autoAdjusted: "Ajusté automatiquement",
          resolution: "Résolution",
          ppd: "PPD",
          resolutionForPpd: "pour le calcul du PPD",
          minPpdMode: "Mode PPD Minimum",
          limitedByMinPpd: "limité par le PPD minimum",
          guides: "Guides",
          ppdHint: "PPD (pixels par degré) = combien de pixels tiennent dans un degré de champ de vision, une mesure de netteté.\n~20 : niveau des casques VR (Steam Frame : 2160 px sur 110°), pixels bien visibles\n30-40 : les pixels ne se remarquent plus à une distance d'assise normale\n60 : niveau rétine, l'œil distingue environ 1 minute d'arc",
          settings: "Réglages",
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
          export_canvas: "画像をエクスポート",
          share: "リンクを共有",
          shareLinkCopied: "共有リンクをコピーしました",
          custom: "カスタム",
          back: "戻る",
          search_games: "ゲームを検索...",
          gt7CockpitMode: "GT7コックピットビューモード",
          specialMode: "特殊モード",
          enabled: "有効",
          disabled: "無効",
          autoAdjusted: "自動調整",
          resolution: "解像度",
          ppd: "PPD",
          resolutionForPpd: "PPD 計算用",
          minPpdMode: "最低PPDモード",
          limitedByMinPpd: "最低PPDによる制限",
          guides: "ガイド",
          ppdHint: "PPD（1度あたりのピクセル数）= 視野1度に何ピクセル入るかを示す鮮明さの指標。\n約20：VRヘッドセット相当（Steam Frame: 110°に2160ピクセル）、ピクセルがはっきり見える\n30〜40：通常の着座距離ではピクセルが目立たない\n60：網膜レベル、人間の目は約1分角を分解できる",
          settings: "設定",
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
