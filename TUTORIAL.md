# Radiks Tutorial

<!-- TOC depthFrom:2 -->

- [Installation](#installation)
  - [Installing MongoDB](#installing-mongodb)
  - [Install node.js](#install-nodejs)
  - [Install yarn](#install-yarn)
- [Download the project](#download-the-project)
- [Configuration](#configuration)
  - [Environment variables](#environment-variables)
  - [Server setup](#server-setup)
  - [Client-side radiks configuration](#client-side-radiks-configuration)
- [The model](#the-model)
  - [Starting out - the `class`](#starting-out---the-class)
  - [Adding a schema](#adding-a-schema)
  - [Adding the `className`](#adding-the-classname)
- [Authentication](#authentication)
  - [Logging in](#logging-in)
  - [Logging out](#logging-out)
  - [Logging the user in](#logging-the-user-in)
- [Running your app](#running-your-app)
- [Creating and fetching messages](#creating-and-fetching-messages)
  - [Creating new messages](#creating-new-messages)
  - [Fetching existing messages](#fetching-existing-messages)
- [Real-time streaming](#real-time-streaming)
  - [Adding a callback for real-time messages](#adding-a-callback-for-real-time-messages)

<!-- /TOC -->

This tutorial will teach you how to build a "Twitter-style" application using radiks.

Radiks is a framework for building applications on top of [Blockstack](https://blockstack.org). Radiks uses the concept of an 'indexing server' to keep track of data across different users. This is required for some types of apps, like social media apps, because Blockstack data is stored in a different place for each user. That's what makes it decentralized! When you use radiks, all data is still stored in a completely decentralized way. The indexing server just keeps track of it all for you, so you can build complex apps easily.

The structure of the project is all set up for you. It's a [next.js](https://nextjs.org/) project, using a node server. Next.js uses 

React, but you won't need to have experience with React to follow this tuturial. All components of the user interface are already built for you. All you need to do is add some code here and there to 'wire up' radiks. In the process, hopefully you'll learn a bit about how radiks works.

## Installation

To use this project, you'll need a few things installed first.

### Installing MongoDB

You'll need to have MongoDB running locally on your machine. You can use their free [community edition](https://docs.mongodb.com/manual/installation/#mongodb-community-edition). Installation instructions are dependent on your environment. To ensure MongoDB is installed and running on your machine, run the command `mongo` in a terminal. If everything is setup, you'll see a command prompt. If it worked, just type `exit` and then hit enter to quit the mongo shell. If you already have MongoDB installed, just make sure it uses at least version 3.6 or higher.

### Install node.js

[Install node.js](https://nodejs.org/en/download/), which will let you run code in this project. It's recommended to just use the LTS version they provide, but if you already have node.js installed, you should be OK. This project was tested with node.js version 10.15.

### Install yarn

[Install yarn](https://yarnpkg.com/lang/en/docs/install/), which is a dependency manager for javascript apps (similar to npm).

## Download the project

Open a terminal, and download the project using Git. Once you've cloned the repository, switch to the `feature/tutorial-start` branch. Finally, run `yarn` to download all necessary dependencies.

~~~bash
git clone https://github.com/blockstack-radiks/banter.git
cd banter
git checkout feature/tutorial-start
yarn
~~~

## Configuration

Now we'll configure our project to use Radiks.

### Environment variables

We need to setup two environment variables. The first is the radiks API URL. This is the URL that radiks can use to fetch and save data. In this project, the URL is the same URL that serves the front-end: `http://localhost:5000`. The second environment variable is our mongoDB URL. Since we're running locally, you can use `mongodb://localhost:27017/radiks-server-banter-tutorial`.

This project is configured with [dotenv](https://github.com/motdotla/dotenv) to use environment variables from a `.env` file. There is already a `.env.sample` file at the root of this project - just create a new file called `.env` and copy the contents of `.env.sample`. Then, you're all set!

### Server setup

The file `server.js` is already set up as an [Express](https://expressjs.com) server that will serve our next.js project. We just need to add the `radiks-server` middleware to our server to have it run all the logic required for radiks.

At line 20 in `server.js`, add the following code:

~~~javascript
const RadiksController = await setup();
server.use('/radiks', RadiksController);
~~~

This will tell our express server to use the radiks middleware. Since we already setup our `MONGODB_URI` environment variable, radiks-server will use that location for storing data.

### Client-side radiks configuration

In our front-end code, that runs in the client's browser, we need to add some code to configure radiks and tell it where to fetch and store data.

At the top of the file `/pages/_app.js`, after our `import` calls (around line 7), there is already a `UserSession` object. This is a concept that is part of blockstack.js, and is used as a 'root object' for calling all user-specific methods, like `loadUserData()` and `redirectToSignIn()`. We need to pass this to radiks.

At line 16, in the `getInitialProps` method, add the following code that calls the `configure()` radiks method:

~~~javascript
configure({
  apiServer: process.env.RADIKS_API_SERVER,
  userSession,
});
~~~

What this does is tell radiks where the API server is, which we already configured in an environment variable. It also passes the `userSession` variable to radiks, so it can use that for calling user-related methods.

We also need to add the same exact code snippet from above inside the `componentWillMount` method. We need to call `configure` in two different places, because our project can technically render React on both the server and the client (this is a feature of next.js).

## The model

A core component of building apps with radiks is using models. This allows you to define a schema around the data of your application. For example, our application has "tweets", which we'll just call "messages".

This tutorial already has a very basic `Message` class created in `/models/Message.js`, which we'll add to for this tutorial.

The schema of our message is very simple - it only has a `content` field, which contains the message content. This field is `decrypted`, because it's meant to be public. The datatype for this field is `String`.

When you build models with radiks, you must define a schema. This tells radiks how to encrypt and decrypt data for this user. Although this tutorial only uses public data, many apps require privacy, and thus require encrypted fields.

### Starting out - the `class`

Each model in radiks is a `class`, which is a `subclass` of the top-level `Model` class. Radiks defines the `Model` class, so you can import it like so:

~~~javascript
import { Model } from 'radiks';
~~~

If you're unfamiliar with how classes work in Javascript, it might help to [read some of the documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).

To define your model class, just make it a subclass of `Model`:

~~~javascript
class Message extends Model {
  // More to come!
}
~~~

### Adding a schema

You need to add a static `schema` property to your class. `static` means that it is a property of the class, as opposed to a property of instances of the class.

The `schema` is a simply object. The keys of the schema are the actual field names. The value refers to the datatype, like `String`, `Array`, `Number`, `Object`, or `Boolean`.

If you want a field to be unencrypted, the value for each field is actually an object, so that you can define options for that field. We'll be using an unencrypted field on our model, so it looks like this:

~~~javascript
class Message extends Model {
  static schema = {
    content: {
      type: String,
      decrypted: true
    },
    createdBy: {
      type: String,
      decrypted: true
    }
  }
}
~~~

### Adding the `className`

It's important that you also define a static `className` property to your class. This tells radiks how to store and query this model - it's kind of like a "table name" in a SQL database. Most of the time, you can just use the same name as your model:

~~~javascript
class Message extends Model {
  static className = 'Message'

  // static schema = ...
}
~~~

## Authentication

Now, we'll write some code to handle users logging in and out of our app. All of this code will live in `/pages/index.js`, which is the 'home page' of our application.

### Logging in

In `pages/index.js`, the React component already has a `login` method. This method will get called when the user clicks on a 'login' link that is already set up. We just need to add the code to log in the user with Blockstack.

Add this code inside the `login` method:

~~~javascript
const { userSession } = getConfig();
userSession.redirectToSignIn();
~~~

Most of this is generic blockstack.js code, but we're pulling our `userSession` variable from `getConfig`, which is a radiks method. This grabs the same info that we passed to `configure` previously. With the `userSession` variable, we can then call `redirectToSignIn()`. After calling this, the user will be redirected to the Blockstack Browser for authentication.

### Logging out

We'll follow a similar process for logging out. In `/pages/index.js`, find the `logout` method. Add this code inside that method:

~~~javascript
const { userSession } = getConfig();
userSession.signUserOut();
this.setState({
  currentUser: null,
});
~~~

This does similar functionality as logging in. We grab the `userSession` variable, and then call `signUserOut`. We also update the React component's state to tell it that the user is now logged out.

### Logging the user in

After the user authenticates from the Blockstack Browser, they'll be redirected back to our app. We need to run some code when the user comes back to finalize authentication. In `/pages/index.js`, find the `componentDidMount` callback, and add this code inside it:

~~~javascript
const { userSession } = getConfig();
if (userSession.isUserSignedIn()) {
  const currentUser = userSession.loadUserData();
  this.setState({ currentUser });
} else if (userSession.isSignInPending()) {
  const currentUser = await userSession.handlePendingSignIn();
  await User.createWithCurrentUser();
  this.setState({ currentUser });
}
~~~

This code does a few things. If the user is already signed in, we're just getting their information and passing it to the React component. If they're just coming back from authentication, we need to sign them in with blockstack.js as well as with Radiks. That's what the code inside the `isSignInPending` block does.

## Running your app

We aren't done, but at this point you can run your app and log in with Blockstack. To run the app, run `node server.js`. This will start the app at http://localhost:5000. You should see a basic app with the ability to log in with Blockstack. Try it out! After logging in, if everything is working, the app should indicate that you're signed in. 

You can't see or create messages yet, though! We'll do that next.

## Creating and fetching messages

We're ready to start creating messages in our app!

### Creating new messages

Find the `/components/feed.js` file. This is our React component that will hold most of the logic for saving and displaying messages.

There is already a form setup in the component, and we need to wire up the `submit` method to save a new message when we hit the 'Submit' button. Find the `submit` method, and add this code:

~~~javascript
const { newMessage } = this.state;
const message = new Message({
  content: newMessage,
  createdBy: this.state.currentUser._id,
});
await message.save();
const { messages } = this.state;
messages.unshift(message);
this.setState({ messages, newMessage: '' });
~~~

Let's walk through what's happening here. First, we're getting the `newMessage` state variable from our React component. This contains the contents of the message that the user wrote in our app. Then, we're constructing a new `Message` object, and we're passing the `content` and `createdBy` attributes. The `createdBy` attribute is our current user, and will allow us to display who made the post. Then, we call `message.save()`, which saves the message data into Gaia and our radiks server. Finally, we add the message to our React component's `messages` state variable, which will tell the component to display the message on the page as soon as it's saved.

### Fetching existing messages

At this point, you can create a message and save it, and it'll be displayed. But if you refresh the page, you won't see any existing messages. Now, we'll fetch existing messages and display them!

Go back into `/pages/index.js`, the React component we were working in before. Make a new static method called `getInitialProps` towards the top of the component, near line 24 - right after we create the `state` variable. Add a new static method that looks like this:

~~~javascript
static async getInitialProps() {
  const messages = await Message.fetchList({
    sort: '-createdAt',
    limit: 10,
  }, { decrypt: false });
  return {
    messages,
  };
}
~~~

The static `getInitialProps` method is a feature of next.js. It's called whenever the component is about to be rendered, both on the server and on the client. This is the best place to fetch data before rendering your component. Because this method will run on the server, the initial page load will already be rendered with any messages that you fetch. That means there won't be any loading time when the user hits the page!

What we're doing in here is calling `Message.fetchList`. This method accepts two arguments. The first argument is the `query` - this is where you can query by different attributes, and also pass different sorting or pagination options. What we're doing is fetching all messages, but sorting to only get the most recent ones, and limiting the results to 10. To sort in descending order, just pass `-` in front of your attribute, like we're doing here. To get a better idea of what options you can pass as the first argument, you can visit the [query-to-mongo](https://github.com/pbatey/query-to-mongo) documentation, which is what is being used 'under the hood'.

The second argument is optional, and allows you to pass options to `fetchList`. Here, we're passing `decrypt: false`, because we can't decrypt models that were created by other users. Besides, our model doesn't contain any encrypted properties, so there is nothing important to decyrypt, anyways.

Finally, we're returning the `messages` array as a property of our React component. This will allow us to display the messages we just fetched.

## Real-time streaming

We're almost done! Now, let's add something fun - streaming and displaying newly created messages in real-time over a Websocket. All of the code in this section will live in `/components/feed.js`.

First, lets add some code to make sure that we don't display messages we personally created don't get duplicated when they come in over the websocket. Find the `submit` function we modified earlier, and change it so that it looks like this:

~~~javascript
async submit() {
  const { newMessage } = this.state;
  const message = new Message({
    content: newMessage,
    createdBy: this.state.currentUser._id,
  });
  const { messages, createdMessageIDs } = this.state;
  messages.unshift(message);
  createdMessageIDs[message._id] = true;
  this.setState({ messages, createdMessageIDs, newMessage: '' });
  await message.save();
}
~~~

The top half of this function is the same, but we're changing our logic a bit in the bottom half. We're saving our new message's `_id` in a `createdMessageIDs` state variable, so that we can keep track of which messages we just created. We're then updating our state with that updated variable. Finally, we're saving the message at the very end of the function. This will do two things - make our app seems faster (because the message is displayed instantly) and we'll be ready for the websocket to not display a duplicate message.

### Adding a callback for real-time messages

In `/components/feed.js`, add a new function called `newMessageListener` after `componentDidMount` - right above the `sumbit` function. It should look like this:

~~~javascript
newMessageListener(message) {
  const { messages } = this.state;
  if (!this.state.createdMessageIDs[message._id]) {
    messages.unshift(message);
    this.setState({ messages });
  }
}
~~~

This function is our callback whenever a new real-time message is found. All we're doing is checking to make sure this isn't a message we just created (which we setup in the last step), and then adding the new message to the top of our feed.

We also need to tell Radiks to call this function when a new message is found. At the bottom of the `componentDidMount` function, add this one line of code:

~~~javascript
Message.addStreamListener(this.newMessageListener.bind(this));
~~~

This will tell Radiks to call your callback whenever a new `Message` model is found.

You can test this out - open two browser tabs and visit your app in both of them. Create a new message in one tab, and it should show up almost instantly in the other tab. Pretty cool!