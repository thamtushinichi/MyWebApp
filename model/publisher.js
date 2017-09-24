var mongoose=require('mongoose');

var schema=mongoose.Schema;
var publisherSchema=new schema(
    {
		publisher_name:{type:String}
    }
);
module.exports=mongoose.model('Publisher',publisherSchema);