var express = require('express'), cors = require('cors');
var app = module.exports = express();

var moment = require("moment");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var security = require('../../config/security');
 
app.set('views', __dirname + '/views');

app.use(express.bodyParser());
app.use(cors());
app.get('/user/new', function(request, response) {
 
  response.render('new');
 
});
app.get('/AuserREST',cors(), function(req, res) {
    //res.header("Access-Control-Allow-Origin", "http://localhost:8000");
	//res.header("Access-Control-Allow-Methods", "GET, POST");
    db
      .User
      .find()
      .exec(function (error, users) {

        if (error) return res.json(error);
    
        res.json(users);

      });
 
});
app.get('/AuserREST/:id',cors(), function(req, res) {
    
    var userId = req.params.id;    
 
      db
      .User
      .findById(userId, function (error, user) {

        if (error) return response.json(error);

        //var now = moment(user.birthdate);   
        res.json(user);

      });
 
});
app.post('/newuserREST', function(req, res) { 

  var u = req.body;
  var naix=u.birthdate;
  var naixArr=naix.split("/");
  naix=naixArr[2]+"/"+naixArr[1]+"/"+naixArr[0];
    
  // podemos acceder a DB sin hacer 
  // require porque es global
  var newUser = new db.User({
    name: u.name,
    userName: u.userName,
    userPwd: u.userPwd,
    birthdate: naix,
    isAdmin: u.isAdmin === 'on' ? true : false
  });
  newUser.save(function(error, user) {
    
    if (error) res.json(error);
 
   res.json({text: 'Ok'});
 
  });
});
app.get('/deleteuserREST/:id', function(req, res) {
    userId = req.params.id;    

    db.User.findByIdAndRemove(userId, function (error, users) {
 
    if (error) return res.json(error);
 
     db
      .User
      .find()
      .exec(function (error, users) {

        if (error) return res.json(error);
    
        res.json(users);

      });
    })
});
app.post('/edituserREST/:id', function(req, res) {
 
   var user = req.body,
   userId = req.params.id;    
    
   var naix=user.birthdate;
   var naixArr=naix.split("/");
   naix=naixArr[2]+"/"+naixArr[1]+"/"+naixArr[0];
   user.birthdate=naix;
    delete user.id;
    delete user._id;
    
    db
    .User
    .findByIdAndUpdate(userId, user, function (error, users) {

    if (error) return res.json(error);

    res.json({text: 'Ok'});

    });
 
});
app.get('/deleteApp/:id/:app', function(req, res) {
 
   userId = req.params.id;    
   app=req.params.app;   
  
 
  db
	.User
	.find( { '_id':userId,'userApp.app': app  }, { "userApp.$" : "1" }, function (error, app) {
		if(Object.keys(app).length>0){
			app[0].userApp[0].remove();
			app[0].save(function (err) {
				res.json({text: err});			  
			});
		}
		
	});
 
});
app.get('/userSaveApp/:id/:app/:token/:refresh_token', function(req, res) {
 
   userId = req.params.id;    
   app=req.params.app;
   token=req.params.token;
   refresh_token=req.params.refresh_token.replace("--|","/");
   // delete user.id.userApp;
  
  var newUserApp = new db.UserApp({
    app: app,
    token: token,
	refresh_token: refresh_token,
	appkey: app,
	param1: ""
  });
  
  
   userId = req.params.id;    
   app=req.params.app;
   appkey=req.params.app;
   refresh_token=refresh_token;
  
 
  db
	.User
	.find( { '_id':userId,'userApp.app': app }, { "userApp.$" : "1" }, function (error, app) {
		if (!error) {
			
			if(Object.keys(app).length>0){
				app[0].userApp[0].remove();
				app[0].save();
			}
			
		}
		//res.json(error);
	});
   db
  .User
  .findById(userId, function (error, user) {
 
   user.userApp.push(newUserApp);
	   user.save(function(error, user) {
		
		if (error) res.json(error);
	 
	   res.json(user);
	 
	  });
  });
  
});
app.get('/userSaveApp/:id/:app/:token/:refresh_token/:param1/:param2/:param3', function(req, res) {
 
   userId = req.params.id;    
   app=req.params.app;
   token=req.params.token;
   refresh_token=req.params.refresh_token.replace("--|","/");
   // delete user.id.userApp;
  
  var newUserApp = new db.UserApp({
    app: app,
    token: token,
	refresh_token: refresh_token,
	appkey: app,
	param1: decodeURIComponent(req.params.param1),
	param2: decodeURIComponent(req.params.param2),
	param3: decodeURIComponent(req.params.param3)
  });
  
  //res.json(newUserApp);
  db
	.User
	.find( { '_id':userId,'userApp.app': app }, { "userApp.$" : "1" }, function (error, app) {
		if (!error) {
			
			if(Object.keys(app).length>0){
				app[0].userApp[0].remove();
				app[0].save();
			}
			
		}
		//res.json(error);
	});
   db
  .User
  .findById(userId, function (error, user) {
 
   user.userApp.push(newUserApp);
	   user.save(function(error, user) {
		
		if (error) res.json(error);
	 
	   res.json(user);
	 
	  });
  });
  
});
app.get('/setAppPosition/:id/:app/:position', function(req, res) {
 
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
app.get('/user',function(request,response){       
    db
      .User
      .find()
      .exec(function (error, users) {

        if (error) return res.json(error);
          
        return response.render('index', {
            userview: users
            ,validateuser: request.session.userActual
        });

      });
});
app.post('/user', function(req, response) {
 
  var u = req.body;
  
  var naix=u.birthdate;
  var naixArr=naix.split("/");
  naix=naixArr[2]+"/"+naixArr[1]+"/"+naixArr[0];
  // podemos acceder a DB sin hacer 
  // require porque es global
  var newUser = new db.User({
    name: u.name,
    userName: u.userName,
    userPwd: u.userPwd,
    birthdate: naix,
    isAdmin: u.isAdmin === 'on' ? true : false
  });
 
  // también podía hacer `new db.User(u)`
  // porque los campos del formulario
  // tienen el mismo nombre del las
  // propiedades del modelo. Para 
  // efectos demostrativos aquí cree
  // un objeto con las mismas propiedades
  // y les asigné los valores que vienen
  // del formulario.
 
  newUser.save(function(error, user) {
    
    if (error) response.json(error);
 
    response.redirect('/user');
 
  });
  
});
app.get('/user/edit/:id', function(request, response) {
 
  var userId = request.params.id;
 
  db
  .User
  .findById(userId, function (error, user) {
 
    if (error) return response.json(error);
    
    //var now = moment(user.birthdate);   
    response.render('edit', {userview:user});
 
  });
 
});
app.post('/user/:id', function(request, response) {
 
    var user = request.body,
     userId = request.params.id;
 
    delete user.id;
    delete user._id;

    db
    .User
    .findByIdAndUpdate(userId, user, function (error, users) {

    if (error) return response.json(error);

    response.redirect('/user');

    });
 
});
app.get('/user/delete/:id', function(request, response) {
 
    var user = request.body,
    userId = request.params.id;    

    db.User.findByIdAndRemove(userId, function (error, users) {
 
    if (error) return response.json(error);
 
    response.redirect('/user');
 
  });
 
});
app.get('/user/logout',function(req,res){       
   req.logout();
   delete req.session.userActual;
   res.redirect('/');
});


app.get('/userSaveFavourite/:id/:Favname/:FavLink', function(req, res) {
 
  userId = req.params.id;    
  
  var newUserFavourite = new db.UserFavourites({
    app: app,
    Favname : req.params.Favname,	  
	Favlink: req.params.FavLink	  });
  
   db
  .User
  .findById(userId, function (error, user) {
 
	user.UserFavourites.push(newUserFavourite);
	user.save(function(error, user) {	
		if (error) res.json(error);	 
		res.json(user);	 	
	});
  });
  
});
app.get('/userDeleteFavourite/:id/:id_favourite', function(req, res) {
 
   userId = req.params.id;    
   idfav=req.params.id_favourite;   
    
   db
	.User
	.find({"_id":userId,'UserFavourites._id': idfav},{ "UserFavourites.$" : "1" }, function (error, user) {
		user[0].UserFavourites[0].remove();
		user[0].save(function (err) {
			res.json({text: err});			  
		});
		res.json({"response":"ok"});
	});
  
});

app.get('/userSaveRSS/:id/:rssname/:rsslink', function(req, res) {
 
  userId = req.params.id;    
  
  var newUserRSSDirections = new db.UserRSSDirections({
    url : req.params.rsslink,	  
	name: req.params.rssname,
	active:-1
  });
  
   db
  .User
  .findById(userId, function (error, user) {
 
	user.UserRSSDirections.push(newUserRSSDirections);
	user.save(function(error, user) {	
		if (error) res.json(error);	 
		res.json(user);	 	
	});
  });
  
});
app.get('/userDeleteRSS/:id/:id_favourite', function(req, res) {
 
   userId = req.params.id;    
   idfav=req.params.id_favourite;   
    
   db
	.User
	.find({"_id":userId,'UserFavourites._id': idfav},{ "UserFavourites.$" : "1" }, function (error, user) {
		user[0].UserFavourites[0].remove();
		user[0].save(function (err) {
			res.json({text: err});			  
		});
		res.json({"response":"ok"});
	});
  
});