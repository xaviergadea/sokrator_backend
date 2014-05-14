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