// models/User.js

var passportLocalMongoose = require('passport-local-mongoose');

module.exports = function(mongoose) {
 
  var Schema = mongoose.Schema;
  var UserFavouritesCategorySchema = new Schema({ 
	  FavCategory : String
  });
  
  return mongoose.model('UserFavouritesCategory', UserFavouritesCategorySchema);
}