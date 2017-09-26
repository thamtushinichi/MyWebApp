

var productModel = require('../model/product');
var categoryModel= require('../model/category');
var publisherModel= require('../model/publisher');
var promise =require('promise');
var async=require('async');
// Upload file setting
var multer	=require('multer');
var storage	=	multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, '../public/images/product');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now()+'_'+file.originalname);
    }
});
var upload = multer({ storage : storage}).single('image');


exports.loadpage= function (req, res,next){
    res.render('product_Admin/productpage',{layout:'layoutadmin'});
};

exports.listproduct= function (req, res,next){

    productModel.find({},null,{sort:{'_id': -1}},function (err, products){
        if (err){
            res.render('product_Admin/productpage',{layout:'layoutadmin'});
            return;
        }
        res.render('product_Admin/listproduct',{items:products,layout:'layoutadmin'});
    });

};

exports.addproduct= function (req, res,next){
    categoryModel.find({},function (err, categories){
        if (err){
            return;
        }
        publisherModel.find({},function (err, publishers){
            if (err){
                return;
            }
            res.render('product_Admin/addproduct',{layout:'layoutadmin',itemsCategory:categories,itemsPublisher:publishers});

        });
    });
};
exports.addproductpost= function (req, res,next){
    var newProduct = {
        product_name: req.body.product_name,
        price: req.body.price,
        publisher_id:req.body.cb2,
        category_id:req.body.cb1,
        technical_parameter: req.body.technical_parameter,
        product_image: "/images/product/default.png",
        description: req.body.description
    };
    var name=req.body.product_name;

    var productData= new productModel(newProduct);

    productModel.findOne({'product_name': name},function (err,product) {
        if(err)
        {
            console.log(err);
            //xử lí khi gặp lỗi ở đây
            res.render('product_Admin/productpage',{layout:'layoutadmin'});
            return;
        }
        if(!product)
        {
            //chưa có tên category này trong db

            productData.save(function (err)
            {
                if(err)
                {
                    res.render('product_Admin/productpage',{layout:'layoutadmin'});
                }
            });
            res.render('product_Admin/addimage',{layout:'layoutadmin',message: 'Bạn thêm thành công',productName:newProduct.product_name});
            return;
        }
        categoryModel.find({},function (err, categories){
            if (err){
                return;
            }
            publisherModel.find({},function (err, publishers){
                if (err){
                    return;
                }
                res.render('product_Admin/addproduct',{layout:'layoutadmin',itemsCategory:categories,itemsPublisher:publishers
                ,message: 'Tên sản phẩm đã có trong hệ thống'});
                return;
            });
            //res.render('product_Admin/listproduct',{items:products,layout:'layoutadmin'});
        });
      //  res.render('product_Admin/addproduct',{layout:'layoutadmin',message: 'Tên sản phẩm đã có trong hệ thống'});

    });

};
exports.addproductimage = function (req,res,next) {
    var productName= req.params.productName;
    var data=req.body.dataFile[0].url;
    console.log(data);
    var xuly= new promise(function (resolve,reject) {
        upload(req,res,function (err) {
            if(err)
            {
                console.log(err);

                return;
            }

            productModel.findOne({'product_name': productName},function (err,product) {
                if(err)
                {
                    console.log(err);

                    return;
                }
                var updateProduct=product;
                // if(!req.file)
                // {
                //     res.render('product_Admin/productpage',{layout:'layoutadmin'});
                //     return;
                // }
               // updateProduct.product_image="/images/product/"+req.file.filename;
                updateProduct.product_image=data;
                updateProduct.save();
                res.json({success : "Add Successfully", status : 200});
                return;
                //res.render('product_Admin/productpage',{layout:'layoutadmin'});
            });

        });
    });

};
exports.deleteProduct=function (req,res,next) {
    var product_id=req.params.id;
    productModel.findByIdAndRemove(product_id).exec();
    res.redirect('/admin/product/listproduct');
};
exports.detailProduct=function (req,res,next) {
    var product_id=req.params.id;
    var productTemp;
    var categoryTemp;
    var publisherTemp;
    async.parallel([
        function(callback) {
            productModel.findOne({'_id': product_id},function (err,product) {
                if (err){
                    callback(err);
                }
                //code at here
                productTemp=product;
                callback();
            });
        }
    ], function(err) {
        if (err) {
            //Handle the error in some way. Here we simply throw it
            //Other options: pass it on to an outer callback, log it etc.
            return next(err) ;
        }
        async.parallel([
        function(callback) {
            categoryModel.findOne({'_id': productTemp.category_id},function (err,category) {
                if (err){
                    callback(err);
                }
                //code at here
                categoryTemp=category;
                callback();
            });
        }
        ], function(err) {
            if (err) {
                //Handle the error in some way. Here we simply throw it
                //Other options: pass it on to an outer callback, log it etc.
                return next(err);
            }
            async.parallel([
                function(callback) {
                    publisherModel.findOne({'_id': productTemp.publisher_id},function (err,publisher) {
                        if (err){
                            callback(err);
                        }
                        //code at here
                        publisherTemp=publisher;
                        callback();
                    });
                }
            ], function(err) {
                if (err) {
                    //Handle the error in some way. Here we simply throw it
                    //Other options: pass it on to an outer callback, log it etc.
                    return next(err);
                }
                res.render('product_Admin/productdetail',{product:productTemp,layout:'layoutadmin',category:categoryTemp,publisher:publisherTemp});
                console.log('Both a and b are saved now');
            });

        });

    });


};

exports.updateProduct= function (req, res,next){
    var id= req.params.id;
    var product_id=req.params.id;
    var productTemp;
    var categoryTemp;
    var publisherTemp;
    async.parallel([
        function(callback) {
            productModel.findOne({'_id': product_id},function (err,product) {
                if (err){
                    callback(err);
                }
                //code at here
                productTemp=product;
                callback();
            });
        }
    ], function(err) {
        if (err) {
            //Handle the error in some way. Here we simply throw it
            //Other options: pass it on to an outer callback, log it etc.
            return next(err) ;
        }
        async.parallel([
            function(callback) {
                categoryModel.findOne({'_id': productTemp.category_id},function (err,category) {
                    if (err){
                        callback(err);
                    }
                    //code at here
                    categoryTemp=category;
                    callback();
                });
            }
        ], function(err) {
            if (err) {
                //Handle the error in some way. Here we simply throw it
                //Other options: pass it on to an outer callback, log it etc.
                return next(err);
            }
            async.parallel([
                function(callback) {
                    publisherModel.findOne({'_id': productTemp.publisher_id},function (err,publisher) {
                        if (err){
                            callback(err);
                        }
                        //code at here
                        publisherTemp=publisher;
                        callback();
                    });
                }
            ], function(err) {
                if (err) {
                    //Handle the error in some way. Here we simply throw it
                    //Other options: pass it on to an outer callback, log it etc.
                    return next(err);
                }
                categoryModel.find({},function (err, categories){
                    if (err){
                        return next(err);
                        return;
                    }
                    publisherModel.find({},function (err, publishers){
                        if (err){
                            return next(err);
                            return;
                        }
                        res.render('product_Admin/productupdate',{product:productTemp,layout:'layoutadmin',
                            itemsCategory:categories,itemsPublisher:publishers,category:categoryTemp,publisher:publisherTemp});
                        console.log('Both a and b are saved now');
                    });
                });

            });

        });

    });
};

exports.updateProductPost= function (req, res,next){
    var id= req.params.id;
    var name=req.body.product_name;

    productModel.findOne({'_id': id},function (err,product) {
        if(err)
        {
            console.log(err);
            //xử lí khi gặp lỗi ở đây
            res.render('product_Admin/productpage',{layout:'layoutadmin'});
            return;
        }
        product.product_name=req.body.product_name;
        product.price=req.body.price;
        product.description=req.body.description;
        product.technical_parameter=req.body.technical_parameter;
        product.save();
        res.render('product_Admin/addimage',{layout:'layoutadmin',message: 'Bạn thêm thành công',productName:product.product_name});
        return;
    });
};