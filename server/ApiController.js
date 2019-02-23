const express = require('express');
const { decorateApp } = require('@awaitjs/express');
const { COLLECTION } = require('radiks-server/app/lib/constants');

const makeApiController = (db) => {
  const Router = decorateApp(express.Router());
  const radiksData = db.collection(COLLECTION);

  Router.getAsync('/messages', async (req, res) => {
    const match = {
      $match: {
        radiksType: 'Message',
      },
    };
    if (req.query.lt) {
      match.$match.createdAt = {
        $lt: parseInt(req.query.lt, 10),
      };
    }
    if (req.query.createdBy) {
      match.$match.createdBy = req.query.createdBy;
    }
    const sort = {
      $sort: { createdAt: -1 },
    };
    const limit = {
      $limit: 10,
    };

    const votesLookup = {
      $lookup: {
        from: COLLECTION,
        localField: '_id',
        foreignField: 'messageId',
        as: 'votes',
      },
    };

    const pipeline = [match, sort, limit, votesLookup];

    const messages = await radiksData.aggregate(pipeline).toArray();

    let username = (req.query.fetcher || req.universalCookies.get('username'));
    if (username) username = username.replace(/"/g, '');
    messages.forEach((message) => {
      message.hasVoted = false;
      if (username) {
        message.votes.forEach((vote) => {
          if (vote.username === username) {
            message.hasVoted = true;
          }
        });
      }
      message.votes = message.votes.length;
    });

    res.json({ messages });
  });

  Router.getAsync('/avatar/:username', async (req, res) => {
    const { username } = req.params;
    const user = await radiksData.findOne({ _id: username });
    let image;
    if (user.profile.image) {
      [image] = user.profile.image;
    }

    if (image) {
      return res.redirect(image.contentUrl);
    }

    return res.redirect('/static/banana.jpg');
  });

  return Router;
};

module.exports = makeApiController;
