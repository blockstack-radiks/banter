require('dotenv').config();

const { sendMail, inviteEmail } = require('../common/lib/mailer');

const run = async () => {
  const lastMessage = {
    _id: 'test-id',
    content: 'Hello, come to Banter @test.id!',
    createdBy: 'hankstoever.id',
    likes: [{}],
  };

  const username = 'test.id';
  const email = 'fake@example.com';

  await sendMail(inviteEmail(lastMessage, username, email));
};

run().then(() => {
  console.log('Done!');
  process.exit();
}).catch((e) => {
  console.error(e);
  process.exit();
});
