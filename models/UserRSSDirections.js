// models/User.js

var passportLocalMongoose = require('passport-local-mongoose');

module.exports = function(mongoose) {
 
  var Schema = mongoose.Schema;
 
  var UserRSSDirectionsSchema = new Schema({ 
	url : String,	  
	name: String,
	active : Boolean
  });
  
  return mongoose.model('UserRSSDirections', UserRSSDirectionsSchema);
}