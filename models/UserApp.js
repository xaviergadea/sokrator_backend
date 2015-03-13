// models/User.js

var passportLocalMongoose = require('passport-local-mongoose');

module.exports = function(mongoose) {
 
  var Schema = mongoose.Schema;
 
  var UserAppSchema = new Schema({ 
	  app : String,
	  token : String,
	  appkey : String,
	  refresh_token: String,
	  param1: String,
	  param2: String,
	  param3: String
  });
  
  return mongoose.model('UserApp', UserAppSchema);
}