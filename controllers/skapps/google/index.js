
var express = require('express');
var app = module.exports = express();
var googleapis = require('googleapis'),
    readline = require('readline');
	
var moment = require("moment");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var security = require('../../../config/security');
var secrets = require('../../../config/secrets');

app.use(googleapis);
app.use(readline);

//app.set('views', __dirname + '/views');

app.use(express.bodyParser());

app.get('/oauthGDrive/:id', function(req,res,done) {
	
	var CLIENT_ID = secrets.google.clientID,
		CLIENT_SECRET = secrets.google.clientSecret,
		REDIRECT_URL = secrets.google.callbackURL,
		SCOPE = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.email';
	
	var rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
	});
	
	var auth = new googleapis.OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
	
	googleapis.discover('drive', 'v2').execute(function(err, client) {
	  var url = auth.generateAuthUrl({ access_type: 'offline',scope: SCOPE, approval_prompt: 'force' });
	  var getAccessToken = function(code) {
		auth.getToken(code, function(err, tokens) {
		  if (err) {
			
			console.log('Error while trying to retrieve access token', err);
			return;
		  }
		  
		  auth.credentials = tokens;
		  
		});
	  };
	  
	  console.log('Visit the url: ', url);
	  //rl.question('Enter the code here:', getAccessToken);
	  res.json({"url" : url});
	});
});
app.get("/oauth2callback?:id", function(req,res) {
	//var getAccessToken = function(code) {
	var CLIENT_ID = secrets.google.clientID,
	CLIENT_SECRET = secrets.google.clientSecret,
	REDIRECT_URL = secrets.google.callbackURL,
	SCOPE = 'https://www.googleapis.com/auth/drive.file';
	var APPKEY=secrets.google.appkey;
	
	var auth = new googleapis.OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
	
	googleapis.discover('drive', 'v2').execute(function(err, client) {
		 
		 
		var getAccessToken = function(code) {
		
		auth.getToken(code, function(err, tokens) {
		  if (err) {
			res.redirect("/ko");
			console.log('Error while trying to retrieve access token', err);
			
		  }
		  //res.redirect("/ok/"+tokens);
		  auth.credentials = tokens;
		  //upload();
		  //var aa=tokens.credentials.access_token;
		  var tokensStr=JSON.stringify(auth);
		  
		  //res.json({"tokens":auth});
		  var resfresh_token=auth.credentials.refresh_token.replace("/","--|");
		  
		  res.redirect("http://v1.sokrato.me/#/skconfig/returnAPI/"+APPKEY+"/"+auth.credentials.access_token+"/"+resfresh_token);
		  
		});
		};
		
		var url = require('url');
		var url_parts = url.parse(req.url, true).query;
		var codeRes = url_parts.code;
		//res.redirect("/ok/"+codeRes);
		getAccessToken(codeRes);
	});
});


app.get('/oauthGMail/:id', function(req,res,done) {
	
	var CLIENT_ID = secrets.gmail.clientID,
		CLIENT_SECRET = secrets.gmail.clientSecret,
		REDIRECT_URL = secrets.gmail.callbackURL,
		SCOPE = 'https://mail.google.com/ https://www.googleapis.com/auth/userinfo.email'
	
	var auth = new googleapis.OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
	
	googleapis.discover('gmail', 'v1').execute(function(err, client) {
	  var url = auth.generateAuthUrl({ access_type: 'offline',scope: SCOPE, approval_prompt: 'force' });	
	  res.json({"url" : url});
	});
});
app.get("/GmailCallback?:id", function(req,res) {
	//var getAccessToken = function(code) {
	var CLIENT_ID = secrets.gmail.clientID,
	CLIENT_SECRET = secrets.gmail.clientSecret,
	REDIRECT_URL = secrets.gmail.callbackURL,
	SCOPE = 'https://mail.google.com/'
	var APPKEY=secrets.gmail.appkey;
	
	var auth = new googleapis.OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
	
	googleapis.discover('gmail', 'v1').execute(function(err, client) {	
		var getAccessToken = function(code) {
		
		auth.getToken(code, function(err, tokens) {
		  if (err) {
			res.redirect("/ko");
			console.log('Error while trying to retrieve access token', err);
			
		  }
		  //res.redirect("/ok/"+tokens);
		  auth.credentials = tokens;
		  //res.json({"a":auth.credentials});
		  var tokensStr=JSON.stringify(auth);
		  
		  var resfresh_token=auth.credentials.refresh_token.replace("/","--|");
		  
		  res.redirect("http://v1.sokrato.me/#/skconfig/returnAPI/"+APPKEY+"/"+auth.credentials.access_token+"/"+resfresh_token);
		  
		});
		}; 
		var url = require('url');
		var url_parts = url.parse(req.url, true).query;
		var codeRes = url_parts.code;		
		var tok=getAccessToken(codeRes);
	});
});

/*app.get("/uploadGoogle",function(req,res){
	var CLIENT_ID = secrets.google.clientID,
	CLIENT_SECRET = secrets.google.clientSecret,
	REDIRECT_URL = secrets.google.callbackURL,
	SCOPE = 'https://www.googleapis.com/auth/drive.file';
	
	
	var auth = new googleapis.OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
	googleapis.discover('drive', 'v2').execute(function(err, client) {
		
		var upload = function() {
		auth.setCredentials({
			access_token: "ya29.HQDvz_cTahsH0R8AAAAPKSKIFjTOBgdLRf01beyXCPBuxzBKrTSDGsRILppzEA"
		});
		client.drive.files
		  .insert({ title: 'My Document', mimeType: 'text/plain' })
		  .withMedia('text/plain', 'Hello World!')
		  .withAuthClient(auth).execute(function(err, result) {
			   var tokensStr=JSON.stringify(err);
			  res.redirect("/ok22/"+tokensStr);
            });
		  
		
		};
		upload();
		
	});
});*/
app.get("/getGDriveFiles/:id/:view",function(req,res){
	var userId = req.params.id;
	var view = req.params.view; 
	var CLIENT_ID = secrets.google.clientID,
	CLIENT_SECRET = secrets.google.clientSecret,
	REDIRECT_URL = secrets.google.callbackURL,
	SCOPE = 'https://www.googleapis.com/auth/drive.file';
	
	db
	.User
	.findOne( { '_id':userId,'userApp.app': 'GD' }, { "userApp.$" : "1" }, function (error, user) {
	
		if (error) return response.json(error);
		if (user) {
			var auth = new googleapis.OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
			
			googleapis.discover('drive', 'v2').execute(function(err, client) {
				auth.setCredentials({
					access_token: user.userApp[0].token,
					refresh_token: user.userApp[0].refresh_token
				});
				
				if (view=="sharedwithme") { param='sharedWithMe=true'; } else if (view=="favourite") { param='starred=true'; } else {param=""}
				client.drive.files
				  .list({'maxResults':60,q:param})
				  .withAuthClient(auth).execute(function(err, result) {
					if (err==null) {
						res.json(result);	
					} else {
						res.json({"error":"token_lost"});	
					}
				});
				  				
			});
		}
	
	});
});

app.get("/getGMailList/:id",function(req,res){
	
	var userId = req.params.id;    
	var CLIENT_ID = secrets.gmail.clientID,
	CLIENT_SECRET = secrets.gmail.clientSecret,
	REDIRECT_URL = secrets.gmail.callbackURL,
	SCOPE = ' https://www.googleapis.com/gmail';
	
	db
	.User
	.findOne( { '_id':userId,'userApp.app': 'GM' }, { "userApp.$" : "1" }, function (error, user) {
		
		if (error) return res.json({"error":"Get User Error"});
		if (user) {
			var auth = new googleapis.OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);			
			googleapis.discover('oauth2', 'v2').execute(function(err, client) {								
				//var getOauthMail = function() {
				if (err==null){
					auth.setCredentials({
						access_token: user.userApp[0].token,
						refresh_token: user.userApp[0].refresh_token
					});
				client.oauth2.userinfo
				  .get()
				  .withAuthClient(auth).execute(function(err, result) {
					  //res.json({"bb":user[0].userApp[0].token});
					  if (err==null){
							var emailOauth=result.email;
							googleapis.discover('gmail', 'v1').execute(function(err, client) {
				
							var MailList = function() {
							
							auth.setCredentials({
								access_token: user.userApp[0].token,
								refresh_token: user.userApp[0].refresh_token							
							});
							//client.gmail.users.messages
													
							client.gmail.users.messages
							  .list({ userId: emailOauth, 'maxResults':10 , 'labelIds':'INBOX' })
							  .withAuthClient(auth).execute(function(err, result) {		
									if (err==null){
										res.json(result);	
									} else {
										res.json({"error":"token_lost"});	
									}
														 
								});		
							};
							MailList();
							
						});
					  } else {
							//res.json(err);  
							res.json({"error":"token_lost"});
					  }
					});
				} else {
					res.json({"error":"oauth error"});
				}
				
				//};
				//getOauthMail();	
				
			});	
		}
	});
});
app.get("/getGMailMessage/:id/:IdMessage",function(req,res){
	var userId = req.params.id;
    var IdMessage = req.params.IdMessage;
	var CLIENT_ID = secrets.gmail.clientID,
	CLIENT_SECRET = secrets.gmail.clientSecret,
	REDIRECT_URL = secrets.gmail.callbackURL,
	SCOPE = ' https://www.googleapis.com/gmail';
	
	db
	.User
	.find( { '_id':userId,'userApp.app': 'GM' }, { "userApp.$" : "1" }, function (error, user) {
	
		if (error) return response.json(error);
		
		var auth = new googleapis.OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
		
		googleapis.discover('oauth2', 'v2').execute(function(err, client) {
			
			var getOauthMail = function() {
			
			auth.setCredentials({
				access_token: user[0].userApp[0].token,
				refresh_token: user[0].userApp[0].refresh_token
			});
			client.oauth2.userinfo
			  .get()
			  .withAuthClient(auth).execute(function(err, result) {
				  //res.json({"bb":user[0].userApp[0].token});
				  if (err==null){
					  	var emailOauth=result.email;
					  	googleapis.discover('gmail', 'v1').execute(function(err, client) {
			
						var MailList = function() {
						
						auth.setCredentials({
							access_token: user[0].userApp[0].token,
							refresh_token: user[0].userApp[0].refresh_token							
						});
						 client.gmail.users.messages
							  .get({ userId: emailOauth, id: IdMessage, format: "full" })
							  .withAuthClient(auth).execute(function(err, result) {											
									//msgs.push({name: result, err: err});
									if (err==null){
										res.json(result);	
									} else {
										res.json({"error":"token_lost"});	
									}
									
							});						
						};
						MailList();
						//res.json({"a":"b"})
					});
				  } else {
						res.json({"error":"token_lost"});
				  }
				});
			  
			
			};
			getOauthMail();		
		});	
		
	});
});