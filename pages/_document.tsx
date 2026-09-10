import { Html, Head, Main, NextScript } from 'next/document'
import { getAllGuideMeta } from '../lib/guide'
import type { DocumentProps } from 'next/document'

// The calculator page is exported with `dynamic(..., { ssr: false })`, so its
// prerendered <body> is empty and no crawler can follow a link rendered inside
// the React tree. This block is emitted straight into the static HTML at build
// time. _document never ships to the client, so it costs the calculator zero
// bytes of JavaScript.
const GuideLinks = ({ page }: { page: string }) => {
  if (page !== '/') return null

  const guides = getAllGuideMeta('en')

  return (
    <nav
      aria-label="Guides"
      style={{
        maxWidth: 780,
        margin: '0 auto',
        padding: '24px 20px 40px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: 14,
        lineHeight: 1.9,
        color: '#6a737d',
      }}
    >
      <strong style={{ color: '#1f2328' }}>Sim racing FOV guides</strong>
      <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
        {guides.map((guide) => (
          <li key={guide.slug}>
            <a style={{ color: '#1677ff' }} href={`/guide/${guide.slug}`}>
              {guide.title}
            </a>
          </li>
        ))}
        <li>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages --
              deliberate: next/link would prefetch the guide route's chunks from
              the calculator page, which must stay the lightest entry point. */}
          <a style={{ color: '#1677ff' }} href="/zh/guide">
            中文教程
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default function Document(props: DocumentProps) {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Favicon variations */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
      </Head>
      <body>
        <Main />
        <GuideLinks page={props.__NEXT_DATA__.page} />
        <NextScript />
      </body>
    </Html>
  )
}
