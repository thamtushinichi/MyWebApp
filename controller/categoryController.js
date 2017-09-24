

var categoryModel = require('../model/category');
var Product=require('../model/product');
var Publisher=require('../model/publisher');
var async=require('async');
exports.get_product=function (req, res, next) {

    var value=req.params['product'];

    switch (value){
        case 'phone':
            value='Điện thoại';
            break;
        case 'player':
            value='Máy nghe nhạc';
            break;
        case 'laptop':
            value='Laptop';
            break;
        case 'tablet':
            value='Máy tính bảng';
            break;
        case 'other':
            value='Phụ kiện';
            break;
    }


    categoryModel.findOne({'category_name': value},function (err,categorys) {

        if(err){
            return;
        }

        console.log(categorys);

        Product.find({'category_id': categorys._id},function (err, products) {
            if(err){
                return;
            }

            Publisher.find({},function (error,publishers) {
                if(error){
                    return;
                }

                res.render('category',{items:products, publishers:publishers} );
            })

        })
    });
};

exports.loadpage= function (req, res,next){
    res.render('category/categorypage',{layout:'layoutadmin'});
};

exports.listcategory= function (req, res,next){

    categoryModel.find({},function (err, categories){
        if (err){
            return;
        }
        res.render('category/listcategory',{items:categories,layout:'layoutadmin'});
    })

};

exports.addcategory= function (req, res,next){
    res.render('category/addcategory',{layout:'layoutadmin'});

};

exports.addcategorypost= function (req, res,next){
    var newCategory = {
        category_name: req.body.category_name
    };
    var name=req.body.category_name;
    console.log(name);
    var categoryData= new categoryModel(newCategory);

    categoryModel.findOne({'category_name': name},function (err,category) {
        if(err)
        {
            console.log(err);
            //xử lí khi gặp lỗi ở đây
            return;
        }
        if(!category)
        {
            //chưa có tên category này trong db
            console.log('chuan bi');
            categoryData.save();
            console.log('chay xong');
            res.render('category/addcategory',{layout:'layoutadmin',message: 'Bạn thêm thành công'});
            return;
        }
        res.render('category/addcategory',{layout:'layoutadmin',message: 'Category đã có trong hệ thống'});
        return;
    });

};

exports.get_product_by_category=function (req, res,next) {
    Product.find({publisher_id: req.params['id']},function (error, products) {
        if(error){
            return;
        }

        Publisher.find({},function (error,publishers) {
            if(error){
                return;
            }

            res.render('category',{items:products, publishers:publishers} );
        })

    });
};


var numpage=0;
exports.get_product_by_category_id=function (req, res,next) {

    var page=parseInt(req.params["page"])-1;
    Product.find({category_id: req.params['id']}).skip(9*page).limit(9).exec(function (error, products) {
        if(error){
            return;
        }
        Publisher.find({},function (error,publishers) {
            if(error){
                return;
            }
            if(page==0){
                Product.find({category_id: req.params['id']},function (err,products1) {
                   if(err){
                       return;
                   }
                   if(products1.length%9==0) {
                       numpage = Math.floor(products1.length / 9);
                   }else {
                       numpage=Math.floor(products1.length/9)+1;
                   }
                    var num=[];
                    for(var i=0;i<numpage;i++){
                        num.push({page:i+1, id: req.params['id']});
                    }
                    res.render('category',{items:products, publishers:publishers, pages:num} );
                    return;
                });
            }else {
                var num = [];
                for(var i=0;i<numpage;i++){
                    num.push({page:i+1, id: req.params['id']});
                }

                res.render('category', {items: products, publishers: publishers, pages: num});
            }
        });

    })
};

exports.get_product_by_condition=function (req, res,next){
    var condition=[];
    condition.push({category_id: req.params['id']});
    if(req.body.publisher!=null){
        condition.push({'publisher_id': req.body.publisher});
    }
    if(req.body.price!=null){
        condition.push({'price':JSON.parse(req.body.price)});
    }


    Product.find({$and:condition},function (error, products) {
        if(error){
            return;
        }

        Publisher.find({},function (error,publishers) {
            if(error){
                return;
            }

            res.render('category',{items:products, publishers:publishers} );
        })

    })


};

exports.listcategorybyid= function (req, res,next){
    var id= req.params.id;
    var productTemp;
    var categoryTemp;
    async.parallel([
        function(callback) {
            Product.find({'category_id':id},function (err, products){
                if (err){
                    callback(err);
                }
                productTemp=products;
                callback();
            });
        },
        function(callback) {
            //If we just pass in the task callback, it will automatically be called with an error, if the db.save() call fails
            categoryModel.findOne({'_id':id},function (err, category){
                if (err){
                    //res.render('category/categorypage',{layout:'layoutadmin'});
                    callback(err);
                }
                categoryTemp=category;
                callback();
            });
        }
    ], function(err) {
        if (err) {
            //Handle the error in some way. Here we simply throw it
            //Other options: pass it on to an outer callback, log it etc.
            return next(err) ;
        }
        res.render('category/productbycategory',{items:productTemp,layout:'layoutadmin',category:categoryTemp});
        console.log('Both a and b are saved now');
    });

};

exports.deleteProduct=function (req, res,next) {
    var product_id=req.params.id;
    Product.findByIdAndRemove(product_id).exec();
    res.redirect('/admin/category/listcategory');
};

exports.updateCategory=function (req, res,next) {
    var id=req.params.id;

    categoryModel.findOne({'_id': id},function (err,category) {
        if(err)
        {
            console.log(err);
            //xử lí khi gặp lỗi ở đây
            res.render('category/categorypage',{layout:'layoutadmin'});
            return;
        }
        res.render('category/categoryupdate',{layout:'layoutadmin',item:category});
        return;
    });
};
exports.updateCategoryPost=function (req, res,next) {
    var id=req.params.id;
    var name=req.body.category_name;
    categoryModel.findOne({'_id': id},function (err,categoryroot) {
        if(err)
        {
            res.redirect('/admin/category/listcategory');
            return;
        }
        categoryModel.findOne({'category_name': name},function (err,category) {
            if(err)
            {
                console.log(err);
                //xử lí khi gặp lỗi ở đây
                res.redirect('/admin/category/listcategory');
                return;
            }
            if(!category)
            {
                //chưa có tên category này trong db
                console.log('chuan bi');
                categoryroot.category_name=name;
                categoryroot.save();
                console.log('chay xong');
                res.render('category/categoryupdate',{layout:'layoutadmin',message: 'Bạn thêm thành công',item:categoryroot});
                return;
            }
            res.render('category/categoryupdate',{layout:'layoutadmin',message: 'Category đã có trong hệ thống',item:categoryroot});
            return;
        });

    });

};