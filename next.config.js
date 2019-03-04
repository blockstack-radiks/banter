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
  },
  webpack: (config, { isServer }) => {
    const newConfig = { ...config };
    if (!isServer) {
      const chunkingDefaults = { minChunks: 2, reuseExistingChunk: true };
      newConfig.optimization.splitChunks.cacheGroups.default = chunkingDefaults;
      newConfig.optimization.splitChunks.minChunks = 2;
    }
    return newConfig;
  },
});
