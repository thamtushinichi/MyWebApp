var mongoose=require('mongoose');

var schema=mongoose.Schema;
var commentSchema=new schema(
    {
        name: {type: String},
        detail: {type:String},
        date:{type:Date, default: Date.now },
        product_id: {type:String}
    }
);


module.exports=mongoose.model('Comment',commentSchema);