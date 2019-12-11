const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');

let radiksServer = process.env.RADIKS_API_SERVER || 'http://localhost:5000';

if (process.env.HEROKU_APP_NAME) {
  radiksServer = `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`;
}

module.exports = withBundleAnalyzer({
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html',
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html',
    },
  },
  env: {
    RADIKS_API_SERVER: radiksServer,
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    APP_ENV: process.env.NODE_ENV || 'development',
  },
  webpack: (config) => {
    config.plugins.push(
      new SWPrecacheWebpackPlugin({
        verbose: true,
        staticFileGlobsIgnorePatterns: [/\.next\//],
        runtimeCaching: [
          {
            handler: 'networkFirst',
            urlPattern: /^http?.*/,
          },
        ],
      })
    );

    return config;
  },
});
