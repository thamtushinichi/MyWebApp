var mongoose=require('mongoose');

var schema=mongoose.Schema;
var productSchema=new schema(
    {
        product_name: {type:String},
        price: {type:Number},
        product_image: {type:String},
        publisher_id: {type:String},
        technical_parameter:{type:String},
        category_id:{type:String},
        description:{type:String}
    }
);


module.exports=mongoose.model('Product',productSchema);