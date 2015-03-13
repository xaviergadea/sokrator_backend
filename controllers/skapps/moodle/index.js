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

app.get('/oauthMoodle/:id/:user/:password/:urlMoodle', function(req,res,done) {
	
	var request = require('request');
	var url=decodeURIComponent(req.params.urlMoodle)+'/webservice/rest/server.php';
	
	 var fs = require('fs'),
        obj

    fs.readFile('config/moodletokens.json', handleFile);
    function handleFile(err, data) {
		
        if (err) throw err
        var obj = JSON.parse(data);
		var items = Object.keys(obj);
		var finded=0;
		items.forEach(function(it) {
			if (url.indexOf(it)>0) {
				finded=1;				
				var criteria = [{ 
					 key:"username",
					 value:decodeURIComponent(req.params.user)
				}];
				request.post(url, {
					form:{"wstoken":obj[it].token,"wsfunction":"core_user_get_users","criteria":criteria,"moodlewsrestformat":"json"}}, 
					function (error, response, body) {
					  if (!error && response.statusCode == 200) {						
						var info = JSON.parse(body);
						if (info.users.length>0) {
							info["token"]=obj[it].token;
							info["iduser"]=info.users[0].id;
							info["username"]=info.users[0].username;
							info["urlMoodle"]=req.params.urlMoodle;
							res.json(info);
						} else {						
							res.json({"response":"ko no user"});
						}
					  } else {
					  	res.json({"response":"ko"});	
					  }
					}
				);								
			}
		});
		if (finded==0) {
			res.json({"response":"ko"});	
		}
	}
	/*request.post(url, {
		form:{"username":decodeURIComponent(req.params.user),"password":decodeURIComponent(req.params.password),"service":"sokratorservice"}}, 
		function (error, response, body) {
		  if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			var url=decodeURIComponent(req.params.urlMoodle)+'/webservice/rest/server.php';
			var criteria = [{ 
				 key:"username",
				 value:decodeURIComponent(req.params.user)
			}];
			
			request.post(url, {
				form:{"wstoken":info.token,"wsfunction":"core_user_get_users","criteria":criteria,"moodlewsrestformat":"json"}}, 
				function (error, response, body) {
				  if (!error && response.statusCode == 200) {
					var info2 = JSON.parse(body);
					info["iduser"]=info2.users[0].id;
					info["username"]=info2.users[0].username;
					info["urlMoodle"]=req.params.urlMoodle;
					res.json(info);
				  }
				}
			);
			
			//res.json(info);
		  } else {
			  res.json(response);
		  }
		}
	);*/
			
});
app.get("/getMoodleList/:id",function(req,res){
	/*
		param1 -- URL Moodle
		param2 -- username
		param3 -- userid
	*/
	var request = require('request');
	var userId = req.params.id;   
	
	db
	.User
	.findOne( { '_id':userId,'userApp.app': 'MD' }, { "userApp.$" : "1" }, function (error, user) {
		if (error) return response.json(error);
		if (user) {
			_getMoodleCourses(user,request,res);			
		}
	});
	
});
function _getMoodleCourses(user,request,res){
	var url=decodeURIComponent(user.userApp[0].param1)+'/webservice/rest/server.php';
	var functionname = 'core_enrol_get_users_courses';
	/*core_calendar_get_calendar_events*/
	request.post(url, {
		form:{"wstoken":user.userApp[0].token,"wsfunction":functionname,"userid":user.userApp[0].param3,"moodlewsrestformat":"json"}}, 
		function (error, response, body) {
		  if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			//return info;
			//res.json(info);
			//_getMoodleGroups(user,info,request,res)
			_getMoodleEvents(user,info,request,res);
		  } else {
			//res.json({"error":body});
			//console.info(response);
			//res.json({"error":url});
			return "error";
		  }
		}
	);	
};
function _getMoodleGroups(user,courses,request,res){
	//res.json({"asdfasdf":user.userApp[0].param2})
	
	var url=decodeURIComponent(user.userApp[0].param1)+'/webservice/rest/server.php';
	
	 var fs = require('fs'),
        obj

    fs.readFile('config/moodletokens.json', handleFile);
    function handleFile(err, data) {		
        if (err) throw err
        var obj = JSON.parse(data);
		var items = Object.keys(obj);
		
		var finded=0;
		items.forEach(function(it) {				
			request.post(url, {
				form:{"wstoken":obj[it].token,"wsfunction":"core_group_get_course_groups","courseid":"408","moodlewsrestformat":"json"}}, 
				function (error, response, body) {
				  //res.json(JSON.parse(body));
				  _getMoodleEvents(user,JSON.parse(body),request,res);
				}
			);		
			
		});		
	}
};

function _getMoodleEvents(user,courses,request,res){
	var CurrentDate = moment().format("X");
	var FinalDate = moment().add(30, 'days').format("X");

	

	//res.json({"asdfasdf":user.userApp[0].param2})

	var url=decodeURIComponent(user.userApp[0].param1)+'/webservice/rest/server.php?moodlewsrestformat=json&wstoken='+user.userApp[0].token+"&wsfunction=core_calendar_get_calendar_events";
	var functionname = 'core_calendar_get_calendar_events';
	var params = {
                "options[userevents]": 1,
                "options[siteevents]": 1,
                "options[timestart]": CurrentDate,
                "options[timeend]": FinalDate,               
            };

	//res.json({"aa":"bb"});
	var events = new Array()
    for (var i=0;i<courses.length-1;i++) {
        params["events[courseids][" + i + "]"] = courses[i].id;
        //events["courseids"][i] = courses[i].id;
    }
    //res.json(params);
   //var paramsSTr=_convertValuesToString(params);    
    var par="&";
    for (var el in params) {
    	par=par+el+"="+params[el]+"&";        
    }
    par=par.substring(par,par.length-1);
    url=url+par;
 	request.post({
	  url: url
	}, function(error, response, body){
		if (error==null){
	  		res.json(JSON.parse(body));
	  	} else {
	  		res.json({"error":"1"});
	  	}
	  });
};