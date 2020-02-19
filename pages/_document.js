import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
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
      <html style={{ background: '#f8a5c2' }} lang="en">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {this.props.styles}
          <link rel="icon" href="/static/cat.png" type="image/png" />
        </Head>
        <body className="custom">
          <Main />
          <NextScript />
          <script src="/static/nprogress.js" async defer />
          <script src="/static/lazysizes.js" async defer />
        </body>
      </html>
    );
  }
}
