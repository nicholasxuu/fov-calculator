import React from "react";
import styles from "../styles/Guide.module.css";
import type { GuideLocale } from "../lib/guide";

// NOTE: every internal link here is a plain <a>, never next/link. next/link
// prefetches the target route's chunks on viewport entry, which would pull the
// calculator's 271 KB antd-mobile bundle onto every guide page. Plain anchors
// keep the guide pages independent of the calculator's JS.

type Props = {
  locale: GuideLocale;
  /** Path of the equivalent page in the other language, for the switcher. */
  altHref: string;
  breadcrumb: { href: string; label: string }[];
  children: React.ReactNode;
};

const COPY = {
  en: {
    home: "FOV Calculator",
    guides: "Guides",
    openCalculator: "Open the FOV calculator",
    switchLang: "中文",
    footer: "Every number on this page is produced by the same formulas the calculator runs.",
  },
  zh: {
    home: "FOV 计算器",
    guides: "教程",
    openCalculator: "打开 FOV 计算器",
    switchLang: "English",
    footer: "本页所有数值都由计算器实际运行的同一套公式得出。",
  },
} as const;

const GuideLayout: React.FC<Props> = ({ locale, altHref, breadcrumb, children }) => {
  const copy = COPY[locale];
  const calculatorHref = locale === "zh" ? "/?lang=cn" : "/";

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <a className={styles.brand} href={calculatorHref}>
          {copy.home}
        </a>
        <a className={styles.langSwitch} href={altHref} hrefLang={locale === "en" ? "zh-CN" : "en"}>
          {copy.switchLang}
        </a>
      </header>

      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        {breadcrumb.map((crumb, index) => (
          <span key={crumb.href}>
            {index > 0 && <span className={styles.crumbSep}>/</span>}
            {index === breadcrumb.length - 1 ? (
              <span aria-current="page">{crumb.label}</span>
            ) : (
              <a href={crumb.href}>{crumb.label}</a>
            )}
          </span>
        ))}
      </nav>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <a className={styles.cta} href={calculatorHref}>
          {copy.openCalculator}
        </a>
        <p className={styles.footerNote}>{copy.footer}</p>
      </footer>
    </div>
  );
};

export default GuideLayout;
