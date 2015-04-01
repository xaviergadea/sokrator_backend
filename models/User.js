// models/User.js

var passportLocalMongoose = require('passport-local-mongoose');

module.exports = function(mongoose) {
 
  var Schema = mongoose.Schema;
  
   var UserFavouritesCategorySchema = new Schema({ 
	  FavCategory : String
  });
  var UserFavouritesSchema = new Schema({ 
	  Favname : String,	  
	  Favlink: String,
	  UserFavouriteCategory : String
  });
  
  var UserAppSchema = new Schema({ 
	  app : String,
	  token : String,	  
	  appkey : String,
	  refresh_token: String,
	  param1: String,
	  param2: String,
	  param3: String
  });
  var UserAppPositionSchema = new Schema({ 
	  app : String,	  
	  position: Number,
	  tab : String
  });
  var UserAppTabsSchema = new Schema({ 
	  tab : String,	  
	  position: Number	 
  });
  var UserRSSDirectionsSchema = new Schema({ 
	  url : String,	  
	  name: String,
	  active : Boolean
  });
  var UserSchema = new Schema({ 
    name : String, // tipo de dato cadena de caracteres
    userName : String,
    userPwd : String,
    birthdate : Date, // tipo de dato fecha
    isAdmin : Boolean, // tipo de dato buleano
	photo : String,
	bgImg : String,
	userApp : [UserAppSchema],
	userAppPosition : [UserAppPositionSchema],
	UserAppTabs : [UserAppTabsSchema],
	UserFavourites : [UserFavouritesSchema],
	UserRSSDirections : [UserRSSDirectionsSchema],
	UserFavouritesCategory : [UserFavouritesCategorySchema]	  
  });
  

UserSchema.methods.validPassword = function( pwd ) {
    // EXAMPLE CODE!
    return ( this.userPwd === pwd );
};
   
// metodo para calcular la edad a partir de la fecha de nacimiento
  UserSchema.methods.formatDateBirth = function() {
    var moment = require("moment");
    var now = moment(this.birthdate); 
    now=now.format("DD-MM-YYYY")
    return now;
    //return ~~((Date.now() - this.birthdate) / (31557600000));
 
  }
  UserSchema.methods.formatDateBirthInvers = function() {
    var moment = require("moment");
    var now = moment(this.birthdate); 
    now=now.format("YYYY-MM-DD")
    return now;
    //return ~~((Date.now() - this.birthdate) / (31557600000));
 
  }
 
    
  return mongoose.model('User', UserSchema);
}