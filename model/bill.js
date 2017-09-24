var mongoose=require('mongoose');

var schema=mongoose.Schema;
var billSchema=new schema(
    {
        name_reciever:{type:String},
        phone_number:{type:String},
        address:{type:String},
        note:{type:String},
        date_of_bill: {type: Date, default: Date.now},
        status_of_bill:{type:Number},
        total:{type:Number},
        user_id:{type:String}
    }
);


module.exports=mongoose.model('Bill',billSchema);