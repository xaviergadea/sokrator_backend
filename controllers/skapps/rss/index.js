var express = require('express');
var app = module.exports = express();
var readline = require('readline');
	
var moment = require("moment");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var security = require('../../../config/security');
var secrets = require('../../../config/secrets');
var http = require('http');



app.use(readline);

//app.set('views', __dirname + '/views');

app.use(express.bodyParser());


app.get("/getRSSList/:id",function(req,res){
  
	var feed = require("feed-read");
	var userId = req.params.id;   
	
	db
	.User
	.find( { '_id':userId,'UserRSSDirections.active': 'true' }, { "UserRSSDirections.$" : "1" }, function (error, app) {
		if (error) res.json(error);
		if (app) {
			
			feed(app[0].UserRSSDirections[0].url, function(err, articles) {
				if (err) res.json(err);					  
				res.json(articles);							
			});
		}
	});
	
	
	
	
});

app.get("/getRSSList/:id/:url",function(req,res){
	var feed = require("feed-read");
	var userId = req.params.id;  
	var url = decodeURIComponent(req.params.url); 
	
	db
	.User
	.find( { '_id':userId}, function (error, user) {
		if (error) res.json(error);
		
		if (user) {
			
			user[0].UserRSSDirections.forEach(function(element) {
				  if (element.url!=url) {
					  element.active=0;
					  user[0].save();
				  } else {
					  element.active=-1;
					  user[0].save();
				  }
				  
            });
			
		}
	});
	
	feed(url, function(err, articles) {
	if (err) res.json(err);					  
	res.json(articles);	
	});
	
});

app.get("/userGetListRSS/:id",function(req,res){
		var userId = req.params.id;   
	
	db
	.User
	.findOne( { '_id':userId}, function (error, user) {
		if (error) return response.json(error);
		if (user) {
			res.json(user.UserRSSDirections);
			//$(user.UserRSSDirections).each(function(index, element) {						
			
		}
	});
	
	
});