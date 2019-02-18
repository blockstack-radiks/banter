module.exports = {
  publicRuntimeConfig: {
    radiks: {
      apiServer: process.env.RADIKS_API_URL || 'http://localhost:5000',
      couchDBName: 'banter',
      couchDBUrl: 'http://127.0.0.1:5984',
    },
  },
  env: {
    RADIKS_API_SERVER: process.env.RADIKS_API_SERVER || 'http://localhost:5000',
  },
};
