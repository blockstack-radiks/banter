import { IS_BROWSER, addGlobalListener } from 'redux-bundler';
const NOT_VISIBLE = 'NOT_VISIBLE';
const VISIBLE = 'VISIBLE';

function getVisibility() {
  if (typeof document === 'undefined') return null;
  // Set the name of the hidden property and the change event for visibility
  let hidden, visibilityChange;
  if (typeof document.hidden !== 'undefined') {
    // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
  }
  return !document[hidden];
}

export default {
  name: 'visible',
  selectIsVisible: (state) => state.visible,
  getReducer: () => {
    const initialState = IS_BROWSER ? getVisibility() : true;
    return (state = initialState, { type }) => {
      if (type === NOT_VISIBLE) return false;
      if (type === VISIBLE) return true;
      return state;
    };
  },
  init: (store) => {
    addGlobalListener('visibilitychange', () => {
      const visible = getVisibility();
      if (visible) {
        store.dispatch({ type: VISIBLE });
      } else {
        store.dispatch({ type: NOT_VISIBLE });
      }
    });
  },
};
