// JavaScript Document
var express = require('express');
var app = module.exports = express();
var readline = require('readline');
	
var moment = require("moment");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var security = require('../../../config/security');
var secrets = require('../../../config/secrets');

var graph = require('fbgraph');

//app.use(Twit);
app.use(readline);

app.get('/oauthFacebook/:id', function(req,res,done) {
	 var authUrl = graph.getOauthUrl({
        "client_id":     secrets.facebook.clientID
      , "redirect_uri":  'http://v2.sokrato.me/index.html',
	    "scope" : 'user_about_me, read_stream'
    });

    res.json({"url" : authUrl});
	
});
app.get('/oauth2callbackFacebook/:code', function(req,res) {
	graph.authorize({
        "client_id": secrets.facebook.clientID
      , "redirect_uri":   'http://v2.sokrato.me/index.html'
      , "client_secret":  secrets.facebook.clientSecret
      , "code":           req.params.code
    }, function (err, facebookRes) {
			if (err) { res.json(err) } else {
				graph.extendAccessToken({
					"access_token": facebookRes.access_token
				  , "client_id": secrets.facebook.clientID
				  , "client_secret": secrets.facebook.clientSecret
				}, function (err, facebookResExtended) {
				   if (err) { res.json(err) }
				   else { res.json(facebookResExtended);}
				});
			}
      //res.json(facebookRes);
    });
	
});

app.get('/getFb/:id', function(req,res) {
	var userId = req.params.id;  	
	
	db
	.User
	.findOne( { '_id':userId,'userApp.app': 'FB' }, { "userApp.$" : "1" }, function (error, user) {
		//res.json(error);
		
		if(error) return res.json(error);
		//res.json({"ok":""})
		if (user) {
			var options = {
				timeout:  10000
			  , pool:     { maxSockets:  Infinity }
			  , headers:  { connection:  "keep-alive" }
			};
			
			graph
			  .setAccessToken(user.userApp[0].refresh_token)
			  .setOptions(options)
			  .get("me/home?locale=ca_ES", function(err, response) {
				res.json(response); // { id: '4', name: 'Mark Zuckerberg'... }
			  });
		} else{
			res.json({"response":"ko"})
		}	
	
	
	});
	
});