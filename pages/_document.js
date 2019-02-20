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
          {this.props.styleTags}
          <link rel="stylesheet" href="/static/nprogress.css" />
          <link rel="icon" href="/static/cat.png" type="image/png" />
          <script src="/static/nprogress.js" />
        </Head>
        <body className="custom">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
