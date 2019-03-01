import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const sheet = new ServerStyleSheet();
    const styleTags = sheet.getStyleElement();
    return { ...initialProps, styleTags };
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {this.props.styleTags}
          <link rel="icon" href="/static/cat.png" type="image/png" />
        </Head>
        <body className="custom">
          <Main />
          <NextScript />
          <script src="/static/nprogress.js" async defer />
        </body>
      </html>
    );
  }
}
