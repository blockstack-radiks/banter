import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { injectGlobal, ServerStyleSheet } from 'styled-components';
import { normalize } from 'polished';

// import theme from '../styled/theme';

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  ${normalize()}
  body, html{
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }
`;

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
          <title>Banter - An app to demo Radiks</title>
          {this.props.styleTags}
        </Head>
        <body className="custom">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
