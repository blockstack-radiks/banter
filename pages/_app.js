import App, { Container } from 'next/app';
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { UserSession, AppConfig } from 'blockstack';
import { configure, getConfig, User } from 'radiks';
import * as linkify from 'linkifyjs';
import mentionPlugin from 'linkifyjs/plugins/mention';
import { CookiesProvider, withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { normalize } from 'polished';
import { withRouter } from 'next/router';
import { AppContext } from '../common/context/app-context';
import Nav from '../components/nav';
import Footer from '../components/footer';
import { theme } from '../common/theme';

mentionPlugin(linkify);

const appConfig = new AppConfig(['store_write', 'publish_data'], process.env.RADIKS_API_SERVER);
const userSession = new UserSession({ appConfig });

const GlobalStyles = createGlobalStyle`
  ${normalize()};
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
    font-variant-numeric: tabular-nums;
  }
  body, html{
    background: #F5F7FB;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    scroll-behavior: smooth;
  }
`;

const Wrapper = withRouter(
  ({ children, username: usernameProps, cookies, router, handleStateUsernameUpdate, ...rest }) => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState(usernameProps);
    const { query } = router;
    const [isSigningIn, setSigningIn] = useState(!!query.authResponse);

    const logout = (cookies) => {
      const { userSession } = getConfig();
      userSession.signUserOut();
      window.location = '/';
      cookies.remove('username');
      handleStateUsernameUpdate({ username: null });
    };

    const handleRemoveQuery = () => {
      window.history.pushState(
        null,
        'Banter',
        `/${window.location.href.substring(window.location.href.lastIndexOf('/') + 1).split('?')[0]}`
      );
    };

    const getCurrentUser = async () => {
      const { userSession } = getConfig();
      if (user) return null;
      if (userSession.isUserSignedIn()) {
        const currentUser = await User.currentUser();
        !username && cookies.set('username', JSON.stringify(currentUser.attrs.username), { path: '/' });
        setUsername(currentUser.attrs.username);
        handleStateUsernameUpdate(currentUser.attrs.username);
        setUser(currentUser);
        handleRemoveQuery();
      } else if (userSession.isSignInPending()) {
        await userSession.handlePendingSignIn();
        const currentUser = await User.createWithCurrentUser();
        !username && cookies.set('username', JSON.stringify(currentUser.attrs.username), { path: '/' });
        setUsername(currentUser.attrs.username);
        handleStateUsernameUpdate(currentUser.attrs.username);
        setUser(currentUser);
        handleRemoveQuery();
      } else if (cookies.get('username')) {
        cookies.remove('username');
      }
    };

    useEffect(() => {
      getCurrentUser();
      if (isSigningIn && !window.location.href.includes('authResponse')) {
        setSigningIn(false);
      }
    });

    return (
      <AppContext.Provider
        value={{
          isLoggedIn: !!username,
          user,
          username,
          getCurrentUser,
          isSigningIn,
          logout: () => logout(cookies),
        }}
      >
        {children}
      </AppContext.Provider>
    );
  }
);

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
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

    let universalCookies = null;
    let username = null;

    if (ctx.req) {
      universalCookies = ctx.req.universalCookies;
      if (universalCookies && universalCookies.cookies && universalCookies.cookies.username) {
        username = JSON.parse(universalCookies.cookies.username);
      }
    }
    return { pageProps: { ...pageProps, userSession, username }, username, universalCookies };
  }

  state = {
    username: this.props.username,
  };

  componentWillMount() {
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
    const { Component, pageProps, universalCookies } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <Container>
          <GlobalStyles />
          <CookiesProvider cookie={universalCookies}>
            <Wrapper
              handleStateUsernameUpdate={this.handleStateUsernameUpdate}
              username={this.state.username}
              cookies={this.props.cookies}
            >
              <Nav />
              <Component {...pageProps} />
              <Footer />
            </Wrapper>
          </CookiesProvider>
        </Container>
      </ThemeProvider>
    );
  }
}

MyApp.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(MyApp);
