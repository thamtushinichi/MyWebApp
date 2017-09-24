var billModel= require('../model/bill');
var bill_detailModel= require('../model/bill_detail');
var productModel= require('../model/product');
var async=require('async');
function compare(a,b) {
    if (a.quantity > b.quantity)
        return -1;
    if (a.quantity < b.quantity)
        return 1;
    return 0;
}
exports.loadpage=function (req,res,next) {
     billModel.find({},null,{sort:{date_of_bill:-1}},function (err, bills){
        if (err){
            res.render('bill/billpage',{layout:'layoutadmin'});
            return;
        }

        res.render('bill/billpage',{items:bills,layout:'layoutadmin'});
    });

};
//
exports.updatebill=function (req,res,next) {
    var id=req.params.id;
    billModel.findOne({'_id': id},function (err, bill){
        if (err){
            res.render('bill/billpage',{layout:'layoutadmin'});
            return;
        }
        res.render('bill/billupdate',{item:bill,layout:'layoutadmin'});
    });

};
exports.updatebillpost=function (req,res,next) {
    var id=req.params.id;
    var status=req.body.status_of_bill;
    console.log('trang thai :'+status);
    billModel.findOne({'_id': id},function (err, bill){
        if (err){
            res.render('bill/billpage',{layout:'layoutadmin'});
            return;
        }
        bill.status_of_bill=status;
        bill.save();
        res.redirect('/admin/bill');
        return;
    });

};

//thống kê doanh số top 10 sản phẩm bán chạy nhất
exports.loadtopproduct=function (req,res,next) {
    var bill_detailsTemp;
    var listbillsendTemp;
    var listbillsend=[];
    async.parallel([
        function(callback) {
            bill_detailModel.find({},null,{sort:{'_id':-1}},function (err, bill_details){
                if (err){
                    callback(err);
                }
                bill_detailsTemp=bill_details;
               callback();
            });
        }
    ], function(err) {
        if (err) {
            //Handle the error in some way. Here we simply throw it
            //Other options: pass it on to an outer callback, log it etc.
            return next(err);
        }
        var billTemp=bill_detailsTemp;
        var listBill=[];
        for(var i=0;i<billTemp.length-1;i++)
        {
            var hashBill={
                product_id: billTemp[i].product_id,
                quantity:billTemp[i].quantity,
                total_price:billTemp[i].total_price
            };
            for(var j=i+1;j<billTemp.length;j++)
            {
                if(billTemp[i].product_id==billTemp[j].product_id)
                {
                    var dem=hashBill.quantity;
                    var gia=hashBill.total_price;
                    dem=dem+billTemp[j].quantity;
                    gia=gia+billTemp[j].total_price;
                    hashBill.quantity=dem;
                    hashBill.total_price=gia;
                    billTemp.splice(j,1);
                }
            }
            listBill.push(hashBill);

        }
        var lastItem=billTemp[billTemp.length-1];
        var xet=0;
        for(var i=0;i<listBill.length;i++)
        {
            if(listBill[i].product_id==lastItem.product_id)
            {
                xet++;
            }
        }
        if(xet==0)
        {
            listBill.push(lastItem);
        }
        //sort array
        listBill.sort(compare);
        listbillsendTemp=listBill;
        if(listbillsendTemp.length<10)
        {
            var condition=[];
            var listbillsendnow=[];
            for(var i=0;i<listbillsendTemp.length;i++)
            {
                condition.push({'_id':listbillsendTemp[i].product_id});

            }
            productModel.find({$or: condition},function(err,products){


                for(var i=0;i<products.length;i++)
                {
                    console.log('iterating done 1');
                   for(var j=0;j<listbillsendTemp.length;j++)
                   {
                       console.log('iterating done 2'+ listbillsendTemp[j].product_id);
                       if(products[i]._id ==listbillsendTemp[j].product_id)
                       {
                           console.log('iterating done 3');
                           var hashbillsend={
                               product_id:listbillsendTemp[j].product_id,
                               product_name: products[i].product_name,
                               quantity:listbillsendTemp[j].quantity,
                               total_price:listbillsendTemp[j].total_price
                           };
                           listbillsendnow.push(hashbillsend);
                           break;
                       }
                   }
                }
                // for(var i=0;i<listbillsendnow.length;i++)
                // {
                //     console.log('product name: '+ listbillsendnow[i].product_name + ' '+ listbillsendnow[i].quantity + ' ' + listbillsendnow[i].total_price);
                // }
                res.render('bill/viewtopproduct',{items:listbillsendnow,layout:'layoutadmin'});
                return;
            });

        }
        else
        {
            var condition=[];
            var listbillsendnow=[];
            for(var i=0;i<10;i++)
            {
                condition.push({'_id':listbillsendTemp[i].product_id});

            }
            productModel.find({$or: condition},function(err,products){


                for(var i=0;i<products.length;i++)
                {
                    console.log('iterating done 1');
                    for(var j=0;j<listbillsendTemp.length;j++)
                    {
                        console.log('iterating done 2'+ listbillsendTemp[j].product_id);
                        if(products[i]._id ==listbillsendTemp[j].product_id)
                        {
                            console.log('iterating done 3');
                            var hashbillsend={
                                product_id:listbillsendTemp[j].product_id,
                                product_name: products[i].product_name,
                                quantity:listbillsendTemp[j].quantity,
                                total_price:listbillsendTemp[j].total_price
                            };
                            listbillsendnow.push(hashbillsend);
                            break;
                        }
                    }
                }

                res.render('bill/viewtopproduct',{items:listbillsendnow,layout:'layoutadmin'});
                return;
            });
        }


    });


};