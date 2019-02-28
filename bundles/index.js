import { composeBundles, createCacheBundle } from 'redux-bundler';
import app from './app';
import user from './user';
import messages from './messages';

export default composeBundles(app, user, messages);
