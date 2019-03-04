import { composeBundles, createCacheBundle } from 'redux-bundler';
import visibility from './visibility';
import user from './user';
import messages from './messages';

export default composeBundles(visibility, user, messages);
