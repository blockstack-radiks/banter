const { setupDB } = require('radiks-server');
require('dotenv').config();

const setup = async () => {
  const auth = {
    databaseName: 'banter',
    adminUser: process.env.COUCHDB_ADMIN,
    adminPassword: process.env.COUCHDB_PASSWORD,
  };
  await setupDB(auth);
  // const db = getDB(auth);
};

setup().catch((e) => {
  console.log(e);
}).finally(() => {
  process.exit();
});
