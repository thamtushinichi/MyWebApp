/**
 * Created by Thanh on 6/19/2017.
 */
var Product= require('../model/product');
var Bill=require('../model/bill');
var BillDetail=require('../model/bill_detail');


exports.get_checkout=function (req, res, next) {
    var query=[];
    var amount={};
    console.log(req.body);
    if(req.body.id[0].length!=1) {
        for (var i = 0; i < req.body.id.length; i++) {
            query.push({'_id': req.body.id[i]});
            amount[req.body.id[i]] = req.body.quantity[i];
        }
    }else {
        query.push({'_id':req.body.id});
        amount[req.body.id] = req.body.quantity;
    }

    Product.find({$or:query}, function (error, products) {
        if(error){
            return;
        }

        var product=[];
        var total=0;
        for(var i=0;i<products.length;i++){
            total+=products[i].price * amount[products[i]._id];
            var p={
                product_id: products[i]._id,
                product_name: products[i].product_name,
                product_price: products[i].price * amount[products[i]._id],
                product_image: products[i].product_image,
                quantiti:amount[products[i]._id]
            };
            product.push(p);
        }
        totalbill=total;
        productssave=product;
        res.render('checkout',{products: product, total: total});
    })
}

var totalbill=0;
var productssave;
exports.confirm_checkout=function (req, res, next) {
    if(totalbill==0){
        return;
    }
    var id=req.body.id;
    var bill=new Bill({
        name_reciever:req.body.name,
        phone_number:req.body.phonenumber,
        address: req.body.address,
        note: req.body.note,
        user_id:req.user._id,
        status_of_bill: 0,
        total:totalbill
    });

    totalbill=0;

    bill.save(function (error) {
        if(error){
            return;
        }


        if(id[0].length!=1) {
            for (var i = 0; i < id.length; i++) {
                var detail = new BillDetail({
                    bill_id: bill._id,
                    product_id: id[i],
                    quantity: req.body.quantity[i],
                    total_price: productssave[i].product_price
                });

                detail.save();
            }
        }else {
            var detail = new BillDetail({
                bill_id: bill._id,
                product_id: id,
                quantity: req.body.quantity
            });

            detail.save();
        }

        res.redirect('/');
    })

}
