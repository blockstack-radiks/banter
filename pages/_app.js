import App, { Container } from 'next/app';
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { UserSession, AppConfig } from 'blockstack';
import { configure, getConfig, User } from 'radiks';
import * as linkify from 'linkifyjs';
import mentionPlugin from 'linkifyjs/plugins/mention';
import { CookiesProvider, withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { withRouter } from 'next/router';
import { AppContext } from '../common/context/app-context';
import Nav from '../components/nav';
import Footer from '../components/footer';
import { theme } from '../common/theme';
import { globalStyles } from '../common/style';

mentionPlugin(linkify);

const makeUserSession = () => {
  const appConfig = new AppConfig(['store_write', 'publish_data'], process.env.RADIKS_API_SERVER);
  const userSession = new UserSession({ appConfig });
  return userSession;
};

const GlobalStyles = globalStyles();

const Wrapper = withRouter(
  ({ children, username: usernameProps, cookies, router, handleStateUsernameUpdate }) => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState(usernameProps);
    const { query } = router;
    const [isSigningIn, setSigningIn] = useState(!!query.authResponse);

    const logout = (_cookies) => {
      const { userSession } = getConfig();
      userSession.signUserOut();
      window.location = '/';
      _cookies.remove('username');
      handleStateUsernameUpdate({ username: null });
    };

    const handleRemoveQuery = () => {
      window.history.pushState(
        null,
        'Banter',
        `${window.location.href.split('?')[0]}`
      );
    };

    const getCurrentUser = async () => {
      const { userSession } = getConfig();
      if (user) return null;
      if (userSession.isUserSignedIn()) {
        const currentUser = await User.currentUser();
        if (username) cookies.set('username', JSON.stringify(currentUser.attrs.username), { path: '/' });
        setUsername(currentUser.attrs.username);
        handleStateUsernameUpdate(currentUser.attrs.username);
        setUser(currentUser);
        handleRemoveQuery();
      } else if (userSession.isSignInPending()) {
        await userSession.handlePendingSignIn();
        const currentUser = await User.createWithCurrentUser();
        if (username) cookies.set('username', JSON.stringify(currentUser.attrs.username), { path: '/' });
        setUsername(currentUser.attrs.username);
        handleStateUsernameUpdate(currentUser.attrs.username);
        setUser(currentUser);
        handleRemoveQuery();
      } else if (cookies.get('username')) {
        cookies.remove('username');
      }
      return true;
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

    let universalCookies = null;
    let username = null;

    if (ctx.req) {
      ({ universalCookies } = ctx.req);
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
