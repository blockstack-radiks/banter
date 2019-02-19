import App, { Container } from 'next/app';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { UserSession, AppConfig } from 'blockstack';
import { configure } from 'radiks';

import Nav from '../components/nav';

const appConfig = new AppConfig(['store_write', 'publish_data'], 'http://localhost:5000');
const userSession = new UserSession({ appConfig });

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {
      userSession,
    };

    console.log(process.env.RADIKS_API_SERVER);
    configure({
      apiServer: process.env.RADIKS_API_SERVER,
      userSession,
    });

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  componentWillMount() {
    console.log(process.env.RADIKS_API_SERVER);
    configure({
      apiServer: process.env.RADIKS_API_SERVER,
      userSession,
    });
  }

  render() {
    const {
      Component, pageProps,
    } = this.props;

    return (
      <ThemeProvider theme={{}}>
        <Container>
          <Nav />
          <Component {...pageProps} serverCookies={this.props.cookies} />
        </Container>
      </ThemeProvider>
    );
  }
}

export default MyApp;
