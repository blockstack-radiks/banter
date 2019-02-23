let radiksServer = process.env.RADIKS_API_SERVER || 'http://localhost:5000';
if (process.env.HEROKU_APP_NAME) {
  radiksServer = `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`;
}

module.exports = {
  env: {
    RADIKS_API_SERVER: radiksServer,
  },
};
