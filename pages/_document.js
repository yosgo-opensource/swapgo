import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon/favicon.ico" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
          <link rel="manifest" href="/favicon/site.webmanifest" />
          <link rel="stylesheet" href="/swapgo/tenuki.min.css"></link>
          <script src="/swapgo/tenuki.min.js"></script>

          <meta name="description" content="Every game of SwapGo is a journey through time; each move, a pivotal moment in history rewritten." />
          <meta name="keywords" content="go game, war game, chess, ai, game" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://go.swap.work/" />
          <meta property="og:title" content="SwapGo" />
          <meta property="og:description" content="Every game of SwapGo is a journey through time; each move, a pivotal moment in history rewritten." />
          <meta property="og:image" content="/logo/swapgo.png" />

          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://go.swap.work/" />
          <meta property="twitter:title" content="SwapGo" />
          <meta property="twitter:description" content="Every game of SwapGo is a journey through time; each move, a pivotal moment in history rewritten." />
          <meta property="twitter:image" content="/logo/swapgo.png" />

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "url": "https://go.swap.work/",
                "name": "SWAPGO",
                "description" : "Every game of SwapGo is a journey through time; each move, a pivotal moment in history rewritten.",
                "url": "https://go.swap.work/",
                "image": "https://go.swap.work/logo/swapgo_trans.png",
                "author": {
                  "@type": "Organization",
                  "name": "SwapGo",
                  "url": "https://go.swap.work"
                },
              })
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
