const express = require('express');
const { decorateApp } = require('@awaitjs/express');

const makeApiController = (db) => {
  const Router = decorateApp(express.Router());
  // console.log(db);

  Router.getAsync('/avatar/:username', async (req, res) => {
    const { username } = req.params;
    const user = await db.findOne({ _id: username });
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
    const users = await db.find({
      radiksType: 'BlockstackUser',
    }, {
      projection: { username: 1 }
    }).toArray();
    const usernames = users.map(({ username }) => username);
    res.json(usernames);
  });

  return Router;
};

module.exports = makeApiController;
