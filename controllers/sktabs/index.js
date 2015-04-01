var express = require('express'), cors = require('cors');
var app = module.exports = express();

var moment = require("moment");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var security = require('../../config/security');
 
app.use(express.bodyParser());
app.use(cors());


/*************************************************************************************************************
/**************************GESTIÓ APLICACIONS RELACIONADES AMB USUARI*****************************************
**************************************************************************************************************/

app.get('/sktabGettab/:id', function(req, res) { 
  userId = req.params.id;
  
   db
  .User
  .findById(userId, function (error, user) { 
	res.json(user.UserAppTabs);	 	
  });
});

app.get('/sktabDeletetab/:id/:tab', function(req, res) {
 
   userId = req.params.id;    
   tab=req.params.tab;   
  
 
  db
	.User
	.find( { '_id':userId,'UserAppTabs._id': tab  }, { "UserAppTabs.$" : "1" }, function (error, tab) {
		if(Object.keys(tab).length>0){
			tab[0].UserAppTabs[0].remove();
			tab[0].save(function (err) {
				if(err) res.json({"no_elements22":err});
				else res.json("ok");			  
			});
		}
		
	});
 
});
app.get('/sktabSavetab/:id/:tab/:name', function(req, res) {
 
   userId = req.params.id;    
   idtab=req.params.tab;
   name=req.params.name;
  
  
   db.User.update(
		{ _id: userId , "UserAppTabs._id":idtab },
		{ $set:{ "UserAppTabs.$.tab":name				 
		} },
		{ upsert: true }, 
		function(err){
			if(err) res.json({"no_elements22":err});
			else res.json("ok");	
		}
	);
  
});

app.get('/setTabPosition/:id/:app/:position', function(req, res) {
 
   userId = req.params.id;    
   app=req.params.app;
   position=req.params.position;
   // delete user.id.userApp;
  
  var newUserAppPosition = new db.userAppPosition({
    app: app,
    position: position
  });
        
  db
	.User
	.find( { '_id':userId,'userAppPosition.position': position }, { "userAppPosition.$" : "1" }, function (error, app) {
		if (!error) {
			if(Object.keys(app).length>0){
				app[0].userAppPosition[0].remove();
				app[0].save();
			}
			
		}
		res.json(error);
	});
   db
  .User
  .findById(userId, function (error, user) {
 
  user.userAppPosition.push(newUserAppPosition);
	   user.save(function(error, user) {
		
		if (error) res.json(error);
	 
	   res.json(user);
	 
	  });
  });
  
});

app.get('/sktabNewtab/:id/:position', function(req, res) { 
  userId = req.params.id;
  position = req.params.position;
  var newUserTab = new db.UserAppTabs({
    tab : "newTab",	  
	position: position	
  });
  
   db
  .User
  .findById(userId, function (error, user) {
 
	user.UserAppTabs.push(newUserTab);
	user.save(function(error, user) {	
		if (error) res.json(error);	 
		res.json(user.UserAppTabs);	 	
	});
  });
});
