import { appUrl } from '../utils';

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const emailify = require('react-emailify').default;

const InviteEmail = require('../../components/email/invite').default;

const FROM = '💩Banter <hello@banter.pub>';

const sendMail = (email) =>
  new Promise(async (resolve, reject) => {
    let transport = null;
    if (process.env.NODE_ENV === 'production') {
      transport = sendgridTransport({
        auth: {
          api_user: process.env.SENDGRID_USERNAME,
          api_key: process.env.SENDGRID_PASSWORD,
        },
      });
    } else {
      transport = {
        port: 1025,
        ignoreTLS: true,
      };
    }

    const client = nodemailer.createTransport(transport);
    client.sendMail(email, (error, info) => {
      if (error) {
        console.log('Error sending email:');
        console.error(error);
        return reject(error);
      }
      return resolve(info);
    });
  });

const mentionedEmail = (mention, message, html) => {
  const url = appUrl();
  return {
    from: FROM,
    to: mention.email,
    subject: `💩You were mentioned by @${message.createdBy}`,
    html,
    text: `
    You were mentioned in a message on Banter:\n
    @${message.createdBy}: ${message.content}\n
    ${url}/messages/${message._id}\n
    Happy Banting!
    `,
  };
};

const updatesEmail = (user, messages, html) => {
  const messageLines = messages.map((message) => `@${message.createdBy}: ${message.content}`);
  const url = appUrl();
  return {
    from: FROM,
    to: user.email,
    subject: `Some 💩from Banter`,
    html,
    text: `
    Hey ${user.username}! Here's a few recent posts on Banter.\n\n
    ${messageLines.join('\n\n')}\n
    Happy Banting!\n\n

    You can get rid of this 💩in your settings page:\n
    ${url}/settings
    `,
  };
};

const inviteEmail = (lastMessage, username, email) => {
  const url = appUrl();
  const emailTemplate = emailify(InviteEmail);
  const html = emailTemplate({
    message: lastMessage,
    username,
  });
  return {
    from: FROM,
    to: email,
    subject: "You've been invited to Banter!",
    html,
    text: `
      Hey @${username}, you've been invited to Banter!\n\n
      @${lastMessage.createdBy} mentioned you in a message:\n\n
      ${lastMessage.content}\n\n
      You can view this message on Banter:\n
      ${url}/messages/${lastMessage._id}\n\n

      Hope to see you soon!
    `,
  };
};

module.exports = {
  sendMail,
  mentionedEmail,
  updatesEmail,
  inviteEmail,
};
