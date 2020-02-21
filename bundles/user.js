import { getConfig, User } from 'radiks';
import { createSelector } from 'redux-bundler';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const setUsernameCookie = (username) => {
  if (!username) return null;
  const d = new Date();
  d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
  cookies.set('username', username, { expires: d });
};

const getUsernameCookie = () => cookies.get('username');

const USER_LOGIN_STARTED = 'user/USER_LOGIN_STARTED';
const USER_LOGIN_FINISHED = 'user/USER_LOGIN_FINISHED';

const USER_SIGNING_IN = 'user/USER_SIGNING_IN';
const USER_SET_USERNAME = 'user/USER_SET_USERNAME';
const USER_LOGOUT = 'user/USER_LOGOUT';
const USER_ERROR = 'user/USER_ERROR';

const doError = (error) => ({ type: USER_ERROR, payload: error });

export default {
  name: 'user',
  getReducer: () => {
    const initialData = {
      data: null,
      lastUpdated: null,
      loading: false,
      signingIn: false,
      error: null,
      username: null,
    };

    return (state = initialData, { type, payload }) => {
      if (type === USER_LOGIN_STARTED) {
        return {
          ...state,
          loading: true,
        };
      }
      if (type === USER_SIGNING_IN) {
        return {
          ...state,
          signingIn: true,
        };
      }
      if (type === USER_LOGIN_FINISHED) {
        return {
          ...state,
          loading: false,
          data: payload,
          lastUpdated: Date.now(),
          signingIn: false,
          username: payload.username,
        };
      }
      if (type === USER_ERROR) {
        return {
          ...state,
          loading: false,
          error: payload,
          lastUpdated: Date.now(),
          signingIn: false,
        };
      }
      if (type === USER_LOGOUT) {
        return {
          ...state,
          loading: false,
          error: null,
          lastUpdated: Date.now(),
          data: null,
          signingIn: false,
        };
      }
      if (type === USER_SET_USERNAME) {
        return {
          ...state,
          username: payload,
        };
      }
      return state;
    };
  },
  doSetUsername: (username) => ({ dispatch, store, getState }) => {
    if (!store.selectCookieUsername(getState())) {
      dispatch({
        type: USER_SET_USERNAME,
        payload: username,
      });
    }
  },
  doFinishLogin: () => async ({ dispatch, store, getState }) => {
    const cookieUsername = store.selectCookieUsername(getState());
    const currentUser = await User.createWithCurrentUser();
    if (cookieUsername !== currentUser.attrs.username) {
      setUsernameCookie(JSON.stringify(currentUser.attrs.username));
    }
    dispatch({
      type: USER_LOGIN_FINISHED,
      payload: currentUser.attrs,
    });
  },
  doSetLoginLoading: () => ({ dispatch }) => {
    dispatch({
      type: USER_LOGIN_STARTED,
    });
  },
  doHandleLogin: () => async ({ dispatch, getState, store }) => {
    dispatch({
      type: USER_SIGNING_IN,
    });
    const cookieUsername = store.selectCookieUsername(getState());
    const { userSession } = getConfig();
    if (userSession.isUserSignedIn()) {
      const currentUser = await User.currentUser();
      if (cookieUsername !== currentUser.attrs.username) {
        setUsernameCookie(JSON.stringify(currentUser.attrs.username));
      }
      dispatch({
        type: USER_LOGIN_FINISHED,
        payload: currentUser.attrs,
      });
    } else if (userSession.isSignInPending()) {
      await userSession.handlePendingSignIn();
      const currentUser = await User.createWithCurrentUser();
      if (cookieUsername !== currentUser.attrs.username) {
        setUsernameCookie(JSON.stringify(currentUser.attrs.username));
      }
      dispatch({
        type: USER_LOGIN_FINISHED,
        payload: currentUser.attrs,
      });
    }
    return true;
  },
  doLogout: () => ({ dispatch, getState, store }) => {
    const { userSession } = getConfig();
    userSession.signUserOut();
    window.location = '/';
    cookies.remove('username');
    dispatch({
      type: USER_LOGOUT,
    });
  },
  selectUserRaw: (state) => state.user.data,
  selectUser: (state) => state.user.data,
  selectUsername: (state) => state.user.data && state.user.data.username,
  selectCookieUsername: (state) => state.user.username,
  selectProfile: (state) => state.user && state.user.data && state.user.data.profile,
  selectUserLoading: (state) => state.user.loading,
  selectUserSigningIn: (state) => state.user.signingIn,
  selectUserLastUpdated: (state) => state.user.lastUpdated,
  reactShouldRemoveAuthRequest: createSelector(
    'selectUser',
    'selectUserSigningIn',
    (user, signingIn) => {
      if (!signingIn && user) {
        if (typeof window !== 'undefined' && window.location.href.includes('authResponse')) {
          // this means there is an authRequest that has not been processed yet!
          window.history.pushState(null, 'Banter', `${window.location.href.split('?')[0]}`);
        }
      }
    }
  ),
  reactShouldHandleLogin: createSelector(
    'selectUser',
    'selectUserSigningIn',
    (user, signingIn) => {
      if (!signingIn && !user) {
        if (typeof window !== 'undefined' && window.location.href.includes('authResponse')) {
          // this means there is an authRequest that has not been processed yet!
          return { actionCreator: 'doHandleLogin' };
        } else if (getUsernameCookie()) {
          return { actionCreator: 'doHandleLogin' };
        } else {
          const isReallyLoggedIn =
            typeof window !== 'undefined' && localStorage && localStorage.getItem('blockstack-session');
          if (isReallyLoggedIn) {
            return { actionCreator: 'doHandleLogin' };
          }
        }
      }
    }
  ),
};
