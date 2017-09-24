var mongoose=require('mongoose');
var passport=require('passport');
var passportLocalMongoose = require('passport-local-mongoose');
var schema=mongoose.Schema;
var usersSchema=new schema(
    {
        username: {type:String},
        password: {type:String},
		name:{type:String},
		email:{type:String},
        role_id: {type:Number}
    }
);
usersSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('Users',usersSchema);