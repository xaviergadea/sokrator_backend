// models/User.js

var passportLocalMongoose = require('passport-local-mongoose');

module.exports = function(mongoose) {
 
  var Schema = mongoose.Schema;
  var UserFavouritesSchema = new Schema({ 
	Favname : String,	  
	Favlink: String	,
	UserFavouriteCategory : String
  });
  
  return mongoose.model('UserFavourites', UserFavouritesSchema);
}