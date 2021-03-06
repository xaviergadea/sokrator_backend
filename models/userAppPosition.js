// models/User.js

var passportLocalMongoose = require('passport-local-mongoose');

module.exports = function(mongoose) {
 
  var Schema = mongoose.Schema;
 
  var userAppPositionSchema = new Schema({ 
  	app : String,	  
	position: Number,
	tab : String  
  });
  
  return mongoose.model('userAppPosition', userAppPositionSchema);
}