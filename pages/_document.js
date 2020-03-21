import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render () {
    return (
      <html>
        <Head>
          <title>COVID-19 SIR Simulation</title>
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
          <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="description" content="This model is based off the SIR model. This is a simulation only to show the possible effects of government mandated social polices and how they might 'flatten the curve'. This is a model only and not based off any real data." />
          <meta property="og:description" content="This model is based off the SIR model. This is a simulation only to show the possible effects of government mandated social polices and how they might 'flatten the curve'. This is a model only and not based off any real data." />
          <meta name="twitter:description" content="This model is based off the SIR model. This is a simulation only to show the possible effects of government mandated social polices and how they might 'flatten the curve'. This is a model only and not based off any real data.yarn dev" />
          <meta property="og:title" content="COVID-19 SIR Simulation" />
          <meta name="twitter:title" content="COVID-19 SIR Simulation" />
          <meta property="og:image" content="/og-image.jpg" />
          <meta name="twitter:image" content="/og-image.jpg" />
          <link href="https://fonts.googleapis.com/css?family=Source+Code+Pro:400,500,700&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
