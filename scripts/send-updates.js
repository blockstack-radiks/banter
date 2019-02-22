require('dotenv').config();
const { getDB } = require('radiks-server');
const { COLLECTION, CENTRAL_COLLECTION } = require('radiks-server/app/lib/constants');
const moment = require('moment');

const { sendMail, updatesEmail } = require('../common/lib/mailer');

const sendUpdates = async () => {
  const db = await getDB();
  const centralCollection = db.collection(CENTRAL_COLLECTION);
  const radiksCollection = db.collection(COLLECTION);
  const frequency = process.env.FREQUENCY;

  const updateTimes = {
    daily: 1000 * 60 * 60 * 24,
    weekly: 1000 * 60 * 60 * 24 * 7,
    hours: 1000 * 60 * 60 * 4, // every 4 hours
  };

  const timeSinceLastSend = updateTimes[frequency];
  if (!timeSinceLastSend) {
    throw new Error('Invalid FREQUENCY argument');
  }

  if (frequency === 'hours') {
    const now = moment();
    const beginOfDay = moment().startOf('day');
    const duration = moment.duration(now.diff(beginOfDay));
    if ((Math.round(duration.asHours()) % 4) !== 0) {
      console.log('Not on a 4-hour interval. Exiting');
      return;
    }
  }

  if (frequency === 'weekly') {
    const now = moment();
    const beginOfDay = moment().startOf('week');
    const duration = moment.duration(now.diff(beginOfDay));
    if ((Math.round(duration.asDays()) % 7) !== 0) {
      console.log('Not on a 7-day interval. Exiting');
      return;
    }
  }

  const nowTime = new Date().getTime();
  const sinceTime = nowTime - timeSinceLastSend;
  // console.log(new Date());
  // console.log(new Date(sinceTime));

  const recentMessages = await radiksCollection.find({
    radiksType: 'Message',
    createdAt: {
      $gte: new Date(sinceTime).getTime(),
    }
  }, {
    limit: 20,
    sort: { createdAt: -1 }
  }).toArray();

  console.log(`Found ${recentMessages.length} messages to send.`);

  if (recentMessages.length === 0) {
    return;
  }

  const usersToUpdate = await centralCollection.find({
    sendUpdates: true,
    updateFrequency: frequency,
    email: {
      $ne: '',
    }
  }).toArray();

  console.log(`Sending new messages to ${usersToUpdate.length} users.`);
  console.log(usersToUpdate);

  const sendMessagesToUsers = usersToUpdate.map((userSettings) => new Promise(async (resolve) => {
    try {
      const user = {
        username: userSettings._id.split('-')[0],
        email: userSettings.email,
      };
      await sendMail(updatesEmail(user, recentMessages));
      resolve();
    } catch (error) {
      console.error(error);
      resolve();
    }
  }));

  await Promise.all(sendMessagesToUsers); 
};

sendUpdates().then(() => {
  console.log('Done!');
  process.exit();
}).catch((error) => {
  console.error(error);
  process.exit();
});
