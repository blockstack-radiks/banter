require('dotenv').config();
const { getDB } = require('radiks-server');
const { COLLECTION, CENTRAL_COLLECTION } = require('radiks-server/app/lib/constants');

if (process.env.NODE_ENV === 'production') {
  console.log('Not clearing in prod.');
  throw new Error('Tried to clear production database');
}

const clearDB = async () => {
  const db = await getDB();

  const radiksData = db.collection(COLLECTION);
  await radiksData.drop();

  const centralData = db.collection(CENTRAL_COLLECTION);
  await centralData.drop();
};

clearDB().then(() => {
  console.log('Done!');
  process.exit();
}).catch((error) => {
  console.error(error);
  process.exit();
});
