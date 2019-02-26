const { getDB } = require('radiks-server');
const { COLLECTION } = require('radiks-server/app/lib/constants');
require('dotenv').config();

const { handleUserSave } = require('../server/lib/image-uploader');

const run = async () => {
  const db = await getDB();
  const collection = db.collection(COLLECTION);

  const users = await collection.find({ radiksType: 'BlockstackUser' }).toArray();

  const saveUsers = users.map((user) => {
    console.log('Saving user:', user._id);
    return handleUserSave(collection, user);
  });

  await Promise.all(saveUsers);
};

run().then(() => {
  console.log('Done!');
  process.exit();
}).catch((error) => {
  console.error(error);
  process.exit();
});

