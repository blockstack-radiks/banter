const express = require('express');
const { decorateApp } = require('@awaitjs/express');

const makeApiController = (db) => {
  const Router = decorateApp(express.Router());
  // console.log(db);

  Router.getAsync('/avatar/:username', async (req, res) => {
    const { username } = req.params;
    const user = await db.findOne({ _id: username });
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
