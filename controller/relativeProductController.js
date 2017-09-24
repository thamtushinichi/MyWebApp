/**
 * Created by Thanh on 6/20/2017.
 */
var Product=require('../model/product');
var BillDetail=require('../model/bill_detail');


exports.get_relative_product=function (id, callback) {
    BillDetail.find({product_id:id},function (err, details) {
        if(err){
            return;
        }
        var products=[];
        if(details.length==0){
            callback(null);
        }
        for(var i=0;i<details.length;i++){
            (function (i) {
                BillDetail.find({'bill_id': details[i].bill_id}, function (err, bills) {
                    for (var j = 0; j < bills.length; j++) {
                        (function (j) {
                            Product.findOne({'_id': bills[j].product_id}, function (error, product) {
                                if (product._id != id) {

                                    products.push(product);
                                }
                                if ((j == bills.length - 1) && (i == details.length - 1)) {
                                    callback(products);
                                    return;
                                }
                            });
                        })(j);
                    }
                });
            })(i);
        }



    });
}