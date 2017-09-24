var mongoose=require('mongoose');

var schema=mongoose.Schema;
var categorySchema= new schema(
    {
        category_name: {type:String}
    }
);

var categoryModel= mongoose.model('Category',categorySchema);
module.exports=categoryModel;