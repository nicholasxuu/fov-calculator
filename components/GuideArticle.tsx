import React from "react";
import Head from "next/head";
import GuideLayout from "./GuideLayout";
import styles from "../styles/Guide.module.css";
import type { GuideDoc, GuideLocale } from "../lib/guide";

export const SITE = "https://fovcalc.xusf.xyz";

const COPY = {
  en: {
    guides: "Guides",
    home: "FOV Calculator",
    toc: "On this page",
    updated: (d: string) => `Last updated ${d}`,
    faq: "Frequently asked questions",
  },
  zh: {
    guides: "教程",
    home: "FOV 计算器",
    toc: "本页目录",
    updated: (d: string) => `最后更新于 ${d}`,
    faq: "常见问题",
  },
} as const;

export const guidePath = (locale: GuideLocale, slug?: string): string => {
  const base = locale === "zh" ? "/zh/guide" : "/guide";
  return slug ? `${base}/${slug}` : base;
};

type Props = {
  locale: GuideLocale;
  doc: GuideDoc;
};

const GuideArticle: React.FC<Props> = ({ locale, doc }) => {
  const copy = COPY[locale];
  const other: GuideLocale = locale === "en" ? "zh" : "en";
  const canonical = `${SITE}${guidePath(locale, doc.slug)}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: copy.home, item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: copy.guides, item: `${SITE}${guidePath(locale)}` },
      { "@type": "ListItem", position: 3, name: doc.title, item: canonical },
    ],
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: doc.title,
    description: doc.description,
    // Identical string to the on-page lead block — structured data and prose
    // can never disagree about what the answer is.
    abstract: doc.directAnswer,
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    dateModified: doc.updated,
    datePublished: doc.updated,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    author: {
      "@type": "Person",
      name: "nicholasxuu",
      url: "https://github.com/nicholasxuu/",
    },
    publisher: {
      "@type": "Organization",
      name: "FOV Calculator",
      url: `${SITE}/`,
    },
    isPartOf: {
      "@type": "WebApplication",
      name: "FOV Calculator",
      url: `${SITE}/`,
    },
    about: { "@type": "Thing", name: "Sim racing field of view" },
  };

  const faqLd = doc.faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: doc.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }
    : null;

  return (
    <>
      <Head>
        <title>{`${doc.title} | FOV Calculator`}</title>
        <meta name="description" content={doc.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" hrefLang="en" href={`${SITE}${guidePath("en", doc.slug)}`} />
        <link rel="alternate" hrefLang="zh-CN" href={`${SITE}${guidePath("zh", doc.slug)}`} />
        <link rel="alternate" hrefLang="x-default" href={`${SITE}${guidePath("en", doc.slug)}`} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={doc.title} />
        <meta property="og:description" content={doc.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="FOV Calculator" />
        <meta property="og:image" content={`${SITE}/assets/images/brz_top.jpg`} />
        <meta property="og:locale" content={locale === "zh" ? "zh_CN" : "en_US"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={doc.title} />
        <meta name="twitter:description" content={doc.description} />
        <meta name="twitter:image" content={`${SITE}/assets/images/brz_top.jpg`} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
        {faqLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
          />
        )}
      </Head>

      <GuideLayout
        locale={locale}
        altHref={guidePath(other, doc.slug)}
        breadcrumb={[
          { href: locale === "zh" ? "/?lang=cn" : "/", label: copy.home },
          { href: guidePath(locale), label: copy.guides },
          { href: guidePath(locale, doc.slug), label: doc.title },
        ]}
      >
        <article>
          <h1 className={styles.title}>{doc.title}</h1>
          {doc.updated && <p className={styles.updated}>{copy.updated(doc.updated)}</p>}

          {doc.directAnswer && <p className={styles.directAnswer}>{doc.directAnswer}</p>}

          {doc.headings.length > 2 && (
            <nav className={styles.toc} aria-label={copy.toc}>
              <p className={styles.tocTitle}>{copy.toc}</p>
              <ol>
                {doc.headings
                  .filter((h) => h.level === 2)
                  .map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`}>{h.text}</a>
                    </li>
                  ))}
              </ol>
            </nav>
          )}

          <div className={styles.article} dangerouslySetInnerHTML={{ __html: doc.html }} />

          {doc.faq.length > 0 && (
            <section className={styles.faq}>
              <h2>{copy.faq}</h2>
              {doc.faq.map((item) => (
                <div className={styles.faqItem} key={item.q}>
                  <h3 className={styles.faqQ}>{item.q}</h3>
                  <p className={styles.faqA}>{item.a}</p>
                </div>
              ))}
            </section>
          )}
        </article>
      </GuideLayout>
    </>
  );
};

export default GuideArticle;
