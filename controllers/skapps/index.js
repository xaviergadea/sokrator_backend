var express = require('express');
var app = module.exports = express();

var moment = require("moment");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var security = require('../../config/security');
 
app.set('views', __dirname + '/views');

app.use(express.bodyParser());

app.get('/skapps',function(req,rs){       
     var fs = require('fs'),
        obj

    fs.readFile('config/skapps.json', handleFile);
    function handleFile(err, data) {
        if (err) throw err
        obj = JSON.parse(data);
        for (var ob in obj) {
            console.log(obj[ob].image);
        }
        return rs.render('index', {
            apps: obj
            ,validateuser: req.session.userActual
        });
    }       
});
app.get('/skappsREST',function(req,res){       
    res.header("Access-Control-Allow-Origin", "http://localhost:8000");
	res.header("Access-Control-Allow-Methods", "GET, POST");
        
    var fs = require('fs'),
        obj

    fs.readFile('config/skapps.json', handleFile);
    function handleFile(err, data) {
        if (err) throw err
        obj = JSON.parse(data);
       //console.log(obj);
        res.json(obj);
    }       
});
