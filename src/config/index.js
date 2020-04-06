require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  app: process.env.APP,
  env: process.env.NODE_ENV,
  secret: process.env.APP_SECRET,
  hostname: process.env.HOSTNAME,
  mongo: {
    uri: process.env.MONGOURI,
    testURI: process.env.MONGOTESTURI,
  },
  apiKey: process.env.API_KEY,
  oauth: {
    google: {
      appID: process.env.GOOGLE_APP_ID,
      appSecret: process.env.GOOGLE_APP_SECRET,
    },
    facebook: {
      appID: process.env.FACEBOOK_APP_ID,
      appSecret: process.env.FACEBOOK_APP_SECRET,
    },
  },
};
