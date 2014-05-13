// models/User.js

var passportLocalMongoose = require('passport-local-mongoose');

module.exports = function(mongoose) {
 
  var Schema = mongoose.Schema;
 
  // Objeto modelo de Mongoose
  var UserSchema = new Schema({
 
    // Propiedad nombre
    name : String, // tipo de dato cadena de caracteres
    
    //Email
    userName : String,
    userPwd : String,
      
    // Propiedad fecha de nacimiento
    birthdate : Date, // tipo de dato fecha
 
    isAdmin : Boolean // tipo de dato buleano
 
  });
 

UserSchema.methods.validPassword = function( pwd ) {
    // EXAMPLE CODE!
    return ( this.userPwd === pwd );
};
   
//var UserSchema = new mongoose.Schema({});

//UserSchema.plugin(passportLocalMongoose);



//var UserModel = mongoose.model('user', UserSchema);

//module.exports = UserModel;

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