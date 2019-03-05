import { aggregateMessages, transformMessageVotes } from '../common/lib/aggregators/messages-aggregator';

const express = require('express');
const request = require('request-promise');
const { decorateApp } = require('@awaitjs/express');
const { COLLECTION } = require('radiks-server/app/lib/constants');
const { uploadImage } = require('./lib/image-uploader');

const { sendMail, inviteEmail } = require('../common/lib/mailer');

const makeApiController = (db) => {
  const Router = decorateApp(express.Router());
  const radiksData = db.collection(COLLECTION);

  Router.getAsync('/messages', async (req, res) => {
    let messages = await aggregateMessages(radiksData, req.query);

    let username = req.query.fetcher || req.universalCookies.get('username');
    if (username) username = username.replace(/"/g, '');
    messages = transformMessageVotes(messages, username);

    res.json({ messages });
  });

  Router.getAsync('/avatar/:username', async (req, res) => {
    const { username } = req.params;
    const user = await radiksData.findOne({ _id: username });
    if (!user) {
      return res.redirect('/static/banana.jpg');
    }
    let image;
    if (user.profile.image) {
      [image] = user.profile.image;
    }

    if (image) {
      return res.redirect(image.contentUrl);
    }

    return res.redirect('/static/banana.jpg');
  });

  Router.getAsync('/usernames', async (req, res) => {
    const users = await radiksData
      .find(
        {
          radiksType: 'BlockstackUser',
        },
        {
          projection: { username: 1 },
        }
      )
      .toArray();

    const usernames = users.map(({ username }) => username && username);
    res.json(usernames);
  });

  Router.getAsync('/user/:username', async (req, res) => {
    const { username } = req.params;
    let user = await radiksData.findOne({
      radiksType: 'BlockstackUser',
      username,
    });

    if (!user) {
      const uri = `https://core.blockstack.org/v1/users/${username}`;
      try {
        const userData = await request({
          uri,
          json: true,
        });
        if (userData[username] && !userData[username].error) {
          user = {
            username,
            profile: userData[username].profile,
          };
        }
      } catch (error) {
        // user not found
      }
    }

    res.json({ attrs: user });
  });

  Router.postAsync('/invite', async (req, res) => {
    const { lastMessage, userEmails } = req.body;
    console.log(lastMessage);
    console.log(userEmails);
    const sendInvites = Object.keys(userEmails).map((username) => new Promise(async (resolve) => {
      const email = userEmails[username];
      try {
        if (email && email.length > 0) {
          await sendMail(inviteEmail(lastMessage, username, email));
        }
        resolve(true);
      } catch (error) {
        console.error(`Error when sending invite email to ${username} (${email}):`);
        console.error(error);
        resolve(true);
      }
    }));

    await Promise.all(sendInvites);

    res.json({ success: true });
  });

  Router.postAsync('/upload', async (req, res) => {
    const { gaiaUrl, filename } = req.body;
    await uploadImage(gaiaUrl, filename);
    res.json({
      success: true,
      url: `https://banter-pub.imgix.net/${filename}`,
    });
  });

  return Router;
};

module.exports = makeApiController;
