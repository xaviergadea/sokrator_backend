// JavaScript Document
var express = require('express');
var app = module.exports = express();
var Twit = require('twit'),
    readline = require('readline');
	
var moment = require("moment");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var security = require('../../../config/security');
var secrets = require('../../../config/secrets');

//app.use(Twit);
app.use(readline);

app.get('/oauthTwitter/:id', function(req,res,done) {
	//var token = _.findWhere(req.user.tokens, { kind: 'twitter' });
	var OAuth = require('oauth');
	var oauth = new OAuth.OAuth(
		  'https://api.twitter.com/oauth/request_token',
		  'https://api.twitter.com/oauth/access_token',
		  secrets.twitter.consumerKey,
		  secrets.twitter.consumerSecret,
		  '1.0A',
		  null,
		  'HMAC-SHA1'
		);
	oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
		if (error) {
			console.log(error);
			res.json(secrets.twitter.clientID)
		}
		else {
			req.session.oauth = {};
			req.session.oauth.token = oauth_token;
			console.log('oauth.token: ' + req.session.oauth.token);
			req.session.oauth.token_secret = oauth_token_secret;
			console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
			var url='https://twitter.com/oauth/authenticate?oauth_token='+oauth_token;
			res.redirect(url)
	}
	});
});
app.get('/oauth2Twittercallback/?', function(req,res,done) {
	var OAuth = require('oauth');
	var APPKEY=secrets.twitter.appkey;
	var oauth = new OAuth.OAuth(
		  'https://api.twitter.com/oauth/request_token',
		  'https://api.twitter.com/oauth/access_token',
		  secrets.twitter.consumerKey,
		  secrets.twitter.consumerSecret,
		  '1.0A',
		  null,
		  'HMAC-SHA1'
		);
	if (req.session.oauth) {
    req.session.oauth.verifier = req.query.oauth_verifier;
    var oauth_data = req.session.oauth;
 
    oauth.getOAuthAccessToken(
      oauth_data.token,
      oauth_data.token_secret,
      oauth_data.verifier,
      function(error, oauth_access_token, oauth_access_token_secret, results) {
        if (error) {
          console.log(error);
          res.json(req.session);
		  res.send("Authentication Failure!");
        }
        else {
          //req.session.oauth.access_token = oauth_access_token;
          //req.session.oauth.access_token_secret = oauth_access_token_secret;
          console.log(results, req.session.oauth);
          res.redirect("http://v1.sokrato.me/#/skconfig/returnAPI/"+APPKEY+"/"+oauth_access_token+"/"+oauth_access_token_secret);
         
        }
      }
    );
  }
  else {
    res.redirect('/login'); // Redirect to login page
  }
});

app.get('/getTwitts/:id', function(req,res,done) {
	var userId = req.params.id;  	
	
	db
	.User
	.findOne( { '_id':userId,'userApp.app': 'TW' }, { "userApp.$" : "1" }, function (error, user) {
		//res.json(error);
		
		if(error) return res.json(error);
		//res.json({"ok":""})
		if (user) {
			var T = new Twit({
				consumer_key: secrets.twitter.consumerKey
			  , consumer_secret: secrets.twitter.consumerSecret
			  , access_token:         user.userApp[0].token
			  , access_token_secret:  user.userApp[0].refresh_token
			});
			T.get('statuses/home_timeline', function(err, data, response) {
			  res.json(data)
			})

		} else{
			res.json({"response":"ko"})
		}	
	
	
	});
});