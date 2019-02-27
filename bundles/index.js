import { composeBundles, createCacheBundle } from 'redux-bundler';
import app from './app';
import messages from './messages';

export default composeBundles(app, messages);
