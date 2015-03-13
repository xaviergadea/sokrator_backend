var express = require('express'), cors = require('cors');;
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

app.post('/loginRest',cors(), passport.authenticate('basic', { session: false }),
  function(req, res) {
    res.json({ id: req.user.id, username: req.user.username });
  }
);
app.post('/loginRestDB', function(req, res) {
 
  var resposta="";
    respostaQuery=db.User.findOne({ userName: req.body.username }, function (err, user) {
      if (err) { resposta='error'; }
      else if (!user) { resposta=0; }
      else if (!user.validPassword(req.body.password)) { resposta=0; }
      else resposta=user;
	  res.json(resposta);	
    });

   
});
app.get('/loginRest2', function(req, res) {
 
  // function(req, username, password, done) {
  //function(username, password, done) {
	  //res.json({ "prova": "AA" });
	var resposta="";
    respostaQuery=db.User.findOne({ userName: "xavsier.gadea@cromlec.com" }, function (err, user) {
      if (err) { resposta='Ok'; }
      else if (!user) { resposta="error usuari"; }
      else if (!user.validPassword("Cromlaec00")) { resposta="error password"; }
      else resposta="ok";
	  //res.json({respostaJson : resposta});
	  res.json(resposta);	
    });
	/*if (respostaQuery) {
		
	   res.send(JSON.stringify(respostaQuery, censor(respostaQuery)));	
	}
	else {
		res.json({respostaJson : "error"});	
	}*/
   //userId = req.params.id;    
   
   

    //res.json({use: req.body.username});

   
});
function censor(censor) {
  var i = 0;

  return function(key, value) {
    if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
      return '[Circular]'; 

    if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
      return '[Unknown]';

    ++i; // so we know we aren't using the original object anymore

    return value;  
  }
}