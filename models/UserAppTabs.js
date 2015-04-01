// models/User.js

var passportLocalMongoose = require('passport-local-mongoose');

module.exports = function(mongoose) {
 
  var Schema = mongoose.Schema;
 
  var UserAppTabsSchema = new Schema({ 
  	tab : String,	  
	position: Number	 
  });
  
  return mongoose.model('UserAppTabs', UserAppTabsSchema);
}