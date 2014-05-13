module.exports = {
  db: process.env.MONGODB|| 'mongodb://localhost/sokrator_v1',
    //db: process.env.MONGODB|| 'mongodb://sokrator:Fiod8eDFkldi@mngdb01.dinaserver.com:27017/sokratorbd',
    //db: process.env.MONGODB|| 'mongodb://sokrator:Fiod8eDFkldi@57.72.87.24/sokratordb',

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',

  localAuth: true,

  mailgun: {
    login: process.env.MAILGUN_LOGIN || 'Your Mailgun SMTP Username',
    password: process.env.MAILGUN_PASSWORD || 'Your Mailgun SMTP Password'
  },

  sendgrid: {
    user: process.env.SENDGRID_USER || 'Your SendGrid Username',
    password: process.env.SENDGRID_PASSWORD || 'Your SendGrid Password'
  },

  nyt: {
    key: process.env.NYT_KEY || 'Your New York Times API Key'
  },

  lastfm: {
    api_key: process.env.LASTFM_KEY || 'Your API Key',
    secret: process.env.LASTFM_SECRET || 'Your API Secret'
  },

  facebookAuth: true,
  facebook: {
    clientID: process.env.FACEBOOK_ID || '222502434555588',
    clientSecret: process.env.FACEBOOK_SECRET || 'dfb1289c6a8af508f54e925db148434e',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
  },

  githubAuth: true,
  github: {
    clientID: process.env.GITHUB_ID || 'f8cac37492658ef24a4c',
    clientSecret: process.env.GITHUB_SECRET || 'af0bd4ff1d28604211d170de8644e2b9a38f3c79',
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
  },

  twitterAuth: true,
  twitter: {
    consumerKey: process.env.TWITTER_KEY || 'SxRyXEnpQeJGXUnfh1qkMQ',
    consumerSecret: process.env.TWITTER_SECRET  || 'hxS4ai5M3vQYkKn5m2QkKtgYT8Yglzby7YWS9lXTg',
    callbackURL: '/auth/twitter/callback',
    passReqToCallback: true
  },

  googleAuth: true,
  google: {
    clientID: process.env.GOOGLE_ID || 'Your Client ID',
    clientSecret: process.env.GOOGLE_SECRET || 'Your Client Secret',
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  },

  linkedinAuth: true,
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'Your Client ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'Your Client Secret',
    callbackURL: '/auth/linkedin/callback',
    scope: ['r_fullprofile', 'r_emailaddress', 'r_network'],
    passReqToCallback: true
  },

  steam: {
    apiKey: process.env.STEAM_KEY || 'Your Steam API Key'
  },

  stripe: {
    apiKey: process.env.STRIPE_KEY || 'Your Stripe API Key'
  },

  twilio: {
    sid: process.env.TWILIO_SID || 'Your Twilio SID',
    token: process.env.TWILIO_TOKEN || 'Your Twilio token'
  },

  clockwork: {
    apiKey: process.env.CLOCKWORK_KEY || 'Your Clockwork SMS API Key'
  },

  tumblr: {
    consumerKey: process.env.TUMBLR_KEY || 'Your Consumer Key',
    consumerSecret: process.env.TUMBLR_SECRET || 'Your Consumer Secret',
    callbackURL: '/auth/tumblr/callback'
  },

  foursquare: {
    clientId: process.env.FOURSQUARE_ID || 'Your Client ID',
    clientSecret: process.env.FOURSQUARE_SECRET || 'Your Client Secret',
    redirectUrl: process.env.FOURSQUARE_REDIRECT_URL || 'http://localhost:3000/auth/foursquare/callback'
  },

  venmo: {
    clientId: process.env.VENMO_ID || 'Your Venmo Client ID',
    clientSecret: process.env.VENMO_SECRET || 'Your Venmo Client Secret',
    redirectUrl: process.env.VENMO_REDIRECT_URL || 'http://localhost:3000/auth/venmo/callback'
  },

  paypal: {
    host: process.env.PAYPAL_HOST || 'api.sandbox.paypal.com',
    client_id: process.env.PAYPAL_ID || 'Your Client ID',
    client_secret: process.env.PAYPAL_SECRET || 'Your Client Secret',
    returnUrl: process.env.PAYPAL_RETURN_URL || 'http://localhost:3000/api/paypal/success',
    cancelUrl: process.env.PAYPAL_CANCEL_URL || 'http://localhost:3000/api/paypal/cancel'
  }
};
