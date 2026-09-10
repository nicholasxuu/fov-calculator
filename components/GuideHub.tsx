import React from "react";
import Head from "next/head";
import GuideLayout from "./GuideLayout";
import { SITE, guidePath } from "./GuideArticle";
import styles from "../styles/Guide.module.css";
import type { GuideLocale, GuideMeta } from "../lib/guide";

const COPY = {
  en: {
    home: "FOV Calculator",
    guides: "Guides",
    title: "Sim Racing FOV Guides",
    description:
      "Field of view guides for sim racing: the geometry behind the formula, triple monitor and curved screen setups, per-game FOV settings, and pixels per degree.",
    lead:
      "These guides explain how sim racing field of view is calculated and what value to enter in each game. Every formula here is the one the FOV Calculator actually runs, read directly from its source, so the numbers on these pages and the numbers the tool outputs always agree.",
  },
  zh: {
    home: "FOV 计算器",
    guides: "教程",
    title: "模拟赛车 FOV 教程",
    description:
      "模拟赛车视场角教程：公式背后的几何原理、三联屏与曲面屏设置、各游戏 FOV 填写值，以及每度像素数（PPD）。",
    lead:
      "这组教程讲清楚模拟赛车的视场角是怎么算出来的，以及每个游戏该填什么值。这里的每条公式都直接取自 FOV 计算器的源码，因此教程上的数字和工具算出的数字永远一致。",
  },
} as const;

type Props = {
  locale: GuideLocale;
  guides: GuideMeta[];
};

const GuideHub: React.FC<Props> = ({ locale, guides }) => {
  const copy = COPY[locale];
  const other: GuideLocale = locale === "en" ? "zh" : "en";
  const canonical = `${SITE}${guidePath(locale)}`;

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: copy.title,
    description: copy.description,
    url: canonical,
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    isPartOf: { "@type": "WebApplication", name: "FOV Calculator", url: `${SITE}/` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: guides.map((guide, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: guide.title,
        description: guide.description,
        url: `${SITE}${guidePath(locale, guide.slug)}`,
      })),
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: copy.home, item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: copy.guides, item: canonical },
    ],
  };

  return (
    <>
      <Head>
        <title>{`${copy.title} | FOV Calculator`}</title>
        <meta name="description" content={copy.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" hrefLang="en" href={`${SITE}${guidePath("en")}`} />
        <link rel="alternate" hrefLang="zh-CN" href={`${SITE}${guidePath("zh")}`} />
        <link rel="alternate" hrefLang="x-default" href={`${SITE}${guidePath("en")}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={copy.title} />
        <meta property="og:description" content={copy.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={`${SITE}/assets/images/brz_top.jpg`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
        />
      </Head>

      <GuideLayout
        locale={locale}
        altHref={guidePath(other)}
        breadcrumb={[
          { href: locale === "zh" ? "/?lang=cn" : "/", label: copy.home },
          { href: guidePath(locale), label: copy.guides },
        ]}
      >
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.directAnswer}>{copy.lead}</p>

        <ul className={styles.cardList}>
          {guides.map((guide) => (
            <li key={guide.slug}>
              <a className={styles.card} href={guidePath(locale, guide.slug)}>
                <p className={styles.cardTitle}>{guide.title}</p>
                <p className={styles.cardDesc}>{guide.description}</p>
              </a>
            </li>
          ))}
        </ul>
      </GuideLayout>
    </>
  );
};

export default GuideHub;
