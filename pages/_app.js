import App, { Container } from 'next/app';
import { decodeToken } from 'jsontokens';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Box } from 'blockstack-ui';
import { UserSession, AppConfig } from 'blockstack';
import { configure } from 'radiks';
import * as linkify from 'linkifyjs';
import mentionPlugin from 'linkifyjs/plugins/mention';
import { CookiesProvider, withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { withRouter } from 'next/router';
import { ReduxBundlerProvider } from 'redux-bundler-hook';
import withReduxStore from '../common/lib/with-redux-store';
import Nav from '../components/nav';
import Footer from '../components/footer';
import { theme } from '../common/theme';
import NewSignInModal from '../components/modal/new-sign-in';
import { globalStyles } from '../common/style';

mentionPlugin(linkify);

const makeUserSession = () => {
  const appConfig = new AppConfig(['store_write', 'publish_data'], process.env.RADIKS_API_SERVER);
  return new UserSession({ appConfig });
};

const GlobalStyles = globalStyles();

const Wrapper = withRouter(({ children }) => (
  <Box flexGrow={1} minHeight="100vh" bg="pink" pb={4}>
    <NewSignInModal />
    {children}
  </Box>
));

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const userSession = makeUserSession();
    let pageProps = {
      userSession,
    };

    configure({
      apiServer: process.env.RADIKS_API_SERVER,
      userSession,
    });

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const universalCookies = null;
    let username = null;

    if (ctx.req) {
      const reqCookies = ctx.req.universalCookies;
      if (reqCookies && reqCookies.cookies && reqCookies.cookies.username) {
        username = JSON.parse(reqCookies.cookies.username);
      }
    }

    const authResponse = ctx.req ? ctx.req.query.authResponse : ctx.query.authResponse;

    if (authResponse) {
      const decoded = decodeToken(authResponse);
      if (decoded.payload && decoded.payload.username) {
        ctx.reduxStore.doSetUsername(decoded.payload.username);
      }
      ctx.reduxStore.doSetLoginLoading();
    }
    if (username) {
      ctx.reduxStore.doSetUsername(username);
    }
    return { pageProps: { ...pageProps, userSession, username }, username, universalCookies };
  }

  state = {
    username: this.props.username,
  };

  componentWillMount() {
    const userSession = makeUserSession();
    configure({
      apiServer: process.env.RADIKS_API_SERVER,
      userSession,
    });
    if (this.state.username !== this.props.username) {
      this.setState({
        username: this.props.username,
      });
    }
  }

  handleStateUsernameUpdate = (username) => this.setState({ username });

  render() {
    const { Component, pageProps, universalCookies, reduxStore } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <Container>
          <GlobalStyles />
          <ReduxBundlerProvider store={reduxStore}>
            <CookiesProvider cookie={universalCookies}>
              <Wrapper
                handleStateUsernameUpdate={this.handleStateUsernameUpdate}
                username={this.state.username}
                cookies={this.props.cookies}
              >
                <Nav />
                <Component reduxStore={reduxStore} {...pageProps} />
                <Footer />
              </Wrapper>
            </CookiesProvider>
          </ReduxBundlerProvider>
        </Container>
      </ThemeProvider>
    );
  }
}

MyApp.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withReduxStore(withCookies(MyApp));
