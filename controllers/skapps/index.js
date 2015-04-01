var express = require('express');
var app = module.exports = express();

var readline = require('readline');
	
var moment = require("moment");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var security = require('../../config/security');
var secrets = require('../../config/secrets');


app.use(readline);

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
app.get('/skappsREST/:userid',function(req,res){       
        
    var fs = require('fs'),
        obj

    fs.readFile('config/skapps.json', handleFile);
    function handleFile(err, data) {
		
        if (err) throw err
        var obj = JSON.parse(data);
		if (req.params.userid!="0") {	
			userid=req.params.userid;
			
			db
			.User
			.find( { '_id':userid,"userApp.app":{$exists:true}}, function (error, app2) {									
				var objApps1 = Object.keys(obj);
				objApps1.forEach(function(objApps2) {
				  
				  var items = Object.keys(obj[objApps2]);
				  items.forEach(function(it) {
					var value = obj[objApps2]["appkey"];
					if(app2.length>0){
						for (var k in app2[0]["userApp"]){					
							if (app2[0]["userApp"][k]["app"]==value){
								obj[objApps2]["active"]=1;	
							}
							
						}						
					}					
				  });
				});
				res.json(obj);
			});	
			
		}
    }       
});
app.get('/skappsPositionREST/:userid/:activetab',function(req,res){       
        
    var fsR = require('fs');
	var fs = require('fs'),
        obj
	var obj2;
	
	fsR.readFile('config/skappsrecomanades.json', handleFileR);
    function handleFileR(err, data) {
		obj2 = JSON.parse(data);
	}
    fs.readFile('config/skapps.json', handleFile);
    function handleFile(err, data) {
		
        if (err) throw err
        var obj = JSON.parse(data);
		//res.json({"app":req.params.userid});
		if (req.params.userid!="0") {	
			userid=req.params.userid;
			activetab=req.params.activetab;
			db
			.User
			.find( { '_id':userid,"userAppPosition.app":{$exists:true}}, function (error, app2) {									
			
				
				var objApps1 = Object.keys(obj);				
				objApps1.forEach(function(objApps2) {
				  
				  var items = Object.keys(obj[objApps2]);
				  
				  items.forEach(function(it) {
					var pos=0;
					var value = obj[objApps2]["appkey"];
					
					if(app2.length>0){
						for (var k in app2[0]["userAppPosition"]){					
							if (app2[0]["userAppPosition"][k]["app"]==value && app2[0]["userAppPosition"][k]["tab"]==activetab){
								pos=1;
								obj[objApps2]["position"]=app2[0]["userAppPosition"][k]["position"];																									
							} else if(pos!=1){
								obj[objApps2]["position"]=0;																										
							}
							
						}						
					}			
				  });
				});
				var objApps1 = Object.keys(obj2);				
				objApps1.forEach(function(objApps2) {
				  
				  var items = Object.keys(obj2[objApps2]);
				  
				  items.forEach(function(it) {
					var pos=0;
					var value = obj2[objApps2]["appkey"];
					if(app2.length>0){
						for (var k in app2[0]["userAppPosition"]){					
							if (app2[0]["userAppPosition"][k]["app"]==value && app2[0]["userAppPosition"][k]["tab"]==activetab){
								pos=1;
								obj2[objApps2]["position"]=app2[0]["userAppPosition"][k]["position"];																									
							} else if(pos!=1){
								obj2[objApps2]["position"]=0;																										
							}
							
						}						
					}		
				  });
				});
				obj["appsRec"]=obj2;
				res.json(obj);
			});	
			
		}
		
       
    }       
});

app.get('/skappsOneAppREST/:userid/:appkey',function(req,res){       
        
    var fs = require('fs'),
        obj

    fs.readFile('config/skapps.json', handleFile);
    function handleFile(err, data) {
		
        if (err) throw err
        var obj = JSON.parse(data);
		//res.json({"app":req.params.userid});
		var objApps1 = Object.keys(obj);
		objApps1.forEach(function(objApps2) {
			if (obj[objApps2].appkey==req.params.appkey)
				res.json(obj[objApps2]);
		});
		
       
    }       
});
app.get('/skappsRecomenadesREST/:userid',function(req,res){       
        
    var fs = require('fs'),
        obj

    fs.readFile('config/skappsrecomanades.json', handleFile);
    function handleFile(err, data) {
		
        if (err) throw err
        var obj = JSON.parse(data);
		//res.json({"app":req.params.userid});
		if (req.params.userid!="0") {	
			userid=req.params.userid;
			
			db
			.User
			.find( { '_id':userid,"userApp.app":{$exists:true}}, function (error, app2) {									
			
				
				var objApps1 = Object.keys(obj);
				objApps1.forEach(function(objApps2) {
				  
				  var items = Object.keys(obj[objApps2]);
				  items.forEach(function(it) {
					
					var value = obj[objApps2]["appkey"];
					if(app2.length>0){
						for (var k in app2[0]["userApp"]){					
							if (app2[0]["userApp"][k]["app"]==value){
								//res.json({"a":app2[k]["userApp"][1]["app"]});									
								obj[objApps2]["active"]=1;	
																								
							}
							
						}						
					}					
				  });
				});
				res.json(obj);
			});	
			
		}
		
       
    }       
});