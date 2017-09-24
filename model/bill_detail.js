var mongoose=require('mongoose');

var schema=mongoose.Schema;
var bill_detailSchema=new schema(
    {
        bill_id: {type: String},
        product_id: {type:String},
		quantity: {type: Number},
        total_price:{type: Number}
    }
);


module.exports=mongoose.model('Bill_detail',bill_detailSchema);