import { createSelector } from 'redux-bundler';
export default {
  name: 'app',
  getReducer: () => {
    const initialData = {
      hasSignedIn: null,
      loading: false,
    };

    return (state = initialData, { type, payload }) => {
      return state;
    };
  },
};
