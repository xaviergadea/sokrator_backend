/**
 * Module dependencies.
 */
 
var express = require('express'), cors = require('cors');
//var exphbs  = require('express3-handlebars');
var http = require('http');
var path = require('path');
require('./models');
var user = require('./controllers/user');
var login = require('./controllers/login');
var skapps = require('./controllers/skapps');
var security = require('./config/security');
//var UserAppModel = require('./models/UserApp');

var UserModel = require('./models/User');
var mongoose = require('mongoose');
var secrets = require('./config/secrets');
var MongoStore = require('connect-mongostore')(express);
var OAuth= require('oauth').OAuth;
var errorhandler = require('errorhandler');


/* CONTROLADORS DE LES APPS CONCRETES*/
var googleapps = require('./controllers/skapps/google');
var twitterapp = require('./controllers/skapps/twitter');
var moodleapp = require('./controllers/skapps/moodle');
var facebookapp = require('./controllers/skapps/facebook');
var favouritesapp = require('./controllers/skapps/favourites');
var rssapp = require('./controllers/skapps/rss');


var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , BasicStrategy = require('passport-http').BasicStrategy;

var app = express();

mongoose.connect(secrets.db);


mongoose.connection.on('error', function() {  
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});

global.db = {
 
    mongoose: mongoose,
	
//models
    User:           require('./models/User')(mongoose),
	UserApp:           require('./models/UserApp')(mongoose),
	userAppPosition:           require('./models/userAppPosition')(mongoose),
	UserFavourites:           require('./models/UserFavourites')(mongoose),
	UserRSSDirections:           require('./models/UserRSSDirections')(mongoose),
	UserFavouritesCategory:           require('./models/UserFavouritesCategory')(mongoose)			
// agregar más modelos aquí en caso de haberlos
};

// modulos
var home = require('./controllers/home');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/layouts');


//app.set('env',"development");
//app.set('view engine', 'jade');

//app.engine('handlebars', exphbs({defaultLayout: 'main'}));
//app.set('view engine', 'handlebars');

app.configure(function() {
  app.use(express.bodyParser({limit: '50mb'}));
  app.use(express.favicon());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(cors());
   //app.use(OAuth());
 
  app.use(express.session({
    secret:'sokratorSecret',
    cookie: {maxAge: 60000 * 60 * 24 * 30}, // 30 days
    store: new MongoStore({
        db:mongoose.connection.db},
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        })
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);

  app.use(user);
  app.use(skapps);
  app.use(login);
  app.use(googleapps);  
  app.use(twitterapp);
  app.use(facebookapp);
  app.use(moodleapp);
  app.use(favouritesapp);
  app.use(rssapp);
});


//app.use(express.compress());
//app.use(express.logger('dev'));
//app.use(express.cookieParser());
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(expressValidator());
//app.use(express.methodOverride());
/*app.use(express.session({
  secret: secrets.sessionSecret,
  store: new MongoStore({
    url: secrets.db,
    auto_reconnect: true
  })
}));
app.use(express.csrf());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals._csrf = req.csrfToken();
  res.locals.secrets = secrets;
  next();
});*/

//passport.use(new LocalStrategy(db.User.authenticate()));
passport.use(new LocalStrategy({    
    usernameField: 'userName',
    passwordField: 'userPwd'
  },
    function(username, password, done) {
    db.User.findOne({ userName: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
          console.log("Incorrect username");
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
          console.log("Incorrect password");
        return done(null, false, { message: 'Incorrect password.' });
      }    
      return done(null, user);
    });
  }
));

passport.use(new BasicStrategy({
    passReqToCallback: true
	}, 
	function(req, username, password, done) {
  //function(username, password, done) {
	  //res.json({ "prova": "AA" });
    db.User.findOne({ userName: req.body.username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.validPassword(req.body.password)) { return done(null, false); }
      return done(null, user);
    });
  }
));
//app.all('/user*',ensureAuthenticated);
//app.all('/user*',getUsuariActual);
/*app.use(passport.session());

app.use(function(req, res, next) {    
  res.locals.user = req.user;
  res.locals._csrf = req.csrfToken();
  res.locals.secrets = secrets;
  next();
});*/

passport.serializeUser(function(user, done) {
    //session.user = req.user;
    //console.log("PROVES");
     done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	
  db.User.findById(id, function(err, user) {      
    done(err, user);
  });
});
function getUsuariActual(req, res, next) {
    if (req.isAuthenticated()) {     
        db.User.findById(req.session.passport.user, function (error, user) {
        if (error) return response.json(error);    
           var userActual=user;
           req.session.userActual=userActual;
           return next(); 
       });
    }    
}
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {         
        return next(); 
    }
    res.redirect('/login/login')
}
function getApps2(fitxer){
    var fs = require('fs'),
        obj

    // Read the file and send to the callback
    fs.readFile('config/skapps.json', handleFile);

    // Write the callback function
    function handleFile(err, data) {
								
        if (err) throw err
        obj = JSON.parse(data);
        return obj;
        // You can now play with your datas
    }   
    return "error";
}


// development only
//if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  
//}

// rutas
app.use(home);
/*app.get('*', function(req,res) {
	if (req.params[0].indexOf(/\?/g)>0) {
		res.json({"bb": req.params[0].replace(/\?/g, "aa")});
	} 
	//res.redirect("/"+req.params[0]);
});*/



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
