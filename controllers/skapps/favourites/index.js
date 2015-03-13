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


app.get("/getFavouriteList/:id",function(req,res){
	var request = require('request');
	var userId = req.params.id;   
	
	db
	.User
	.findOne( { '_id':userId }, function (error, user) {
		if (error) return response.json(error);
		if (user) {
			res.json(user);
		}
	});
	
});
app.get("/getFavouriteItem/:id/:itemId",function(req,res){
	var request = require('request');
	var userId = req.params.id;   
	var itemId = req.params.itemId;   
	
	db
	.User
	.findOne( { '_id':userId,'UserFavourites._id': itemId }, { "UserFavourites.$" : "1" }, function (error, itemFav) {
			if (error) return response.json(error);
		if (itemFav) {
			res.json(itemFav);
		}else {
			res.json("no_elements")				
		}
	});
	
});
app.get("/getFavouriteCategoriesList/:id",function(req,res){
	var request = require('request');
	var userId = req.params.id;   
	
	db
	.User
	.findOne( { '_id':userId }, function (error, user) {
		if (error) return response.json(error);
		if (user) {
			res.json(user.UserFavouritesCategory);
		}
	});
	
});
app.get("/getFavouriteListByCategory/:id/:categoryId",function(req,res){
	var request = require('request');
	var userId = req.params.id;
	var categoryId = req.params.categoryId;   
	
	if (categoryId==0) {
		db
		.User
		.findOne( { '_id':userId }, function (error, user) {
			if (error) return response.json(error);
			if (user) {
				res.json(user.UserFavourites);
			} else {
				res.json("no_elements")				
			}
		});
	} else {
		
		db
		.User
		.findOne( { '_id':userId }, function (error, user) {
			if (error) return response.json(error);
			if (user) {
				var arrObj=Array();
				var arrObj2=user.UserFavourites;
				var	k=0;
				for (var i=0;i<=arrObj2.length-1;i++) {
					if (arrObj2[i].UserFavouriteCategory==categoryId) {
						arrObj[k]=arrObj2[i];
						k++;
					}
				}		
				res.json(arrObj)			
			} else {
				res.json("no_elements")				
			}
		});
		
		/*db.User
		.where('_id').equals(userId)		
		.select('UserFavourites.Favname UserFavourites.Favlink UserFavourites.UserFavouriteCategory')
		.exec(function (error, user) {
			if (error) res.json({"error":"error"});			
			if (user) {				
				var arrObj=user[0].UserFavourites;
				var arrObj2=user[0].UserFavourites;							
				for (var i=0;i<=arrObj2.length-2;i++) {
					if (arrObj2[i].UserFavouriteCategory!=categoryId) {
						arrObj.splice(i);
						var kk=i;
					}
				}			
				res.json({"AA":user});
			} else {
				res.json("no_elements")				
			}});*/
	}
	
});