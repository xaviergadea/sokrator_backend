var express = require('express');
var app = module.exports = express();

var moment = require("moment");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var security = require('../../config/security');
 
app.set('views', __dirname + '/views');

app.use(express.bodyParser());


app.get('/login/login',function(request,response){
     response.render('login', { layout: 'login' });
});
app.post('/login/login', passport.authenticate('local', {    
   successRedirect: '/user/',
   failureRedirect: '/user/login'
}));
