# Banter

Banter is an app that is built to demonstrate the capabilities of [radiks](https://github.com/blockstack-radiks/radiks). It's a Twitter-style app, with a global feed of messages.

## Development

To run Banter locally, first make sure you have MongoDB installed and running on your machine.

By default, Radiks will use the `radiks-server-data` database on your local MongoDB installation. If you're developing other Radiks apps, it's highly suggested that you use a different database name. You can configure this by creating a `.env` file with the following contents:

~~~
MONGODB_URI=mongodb://localhost:27017/radiks-server-banter
~~~

Then, install dependencies by running `yarn`. To run the app, run `yarn start`. The app will run on http://localhost:5000.