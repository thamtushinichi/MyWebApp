/**
 * Created by Thanh on 6/9/2017.
 */

var Product=require("../model/product");
var Comment=require("../model/comment");
var Publisher=require("../model/publisher");
var Category=require('../model/category');
var relativeController=require('../controller/relativeProductController');


exports.list= function (req, res,next){
    Category.find({}, function (err, cate) {
        if(err){
            return;
        }

        var mongo=[];
        for(var i=0;i<cate.length;i++){
            mongo.push({category_id:cate[i]._id});
        }

        Product.find({$or:mongo},function (err, products){
            if (err){
                return;
            }

            var product=[];
            for(var i=0;i<cate.length;i++){
                cate[i].products=[];
                for(var j=0;j<products.length;j++){
                    if(products[j].category_id==cate[i]._id){
                        if(cate[i].products.length<3){
                            cate[i].products.push(products[j]);
                        }
                    }
                    if(product.length<4){
                        product.push(products[products.length-1-j]);
                    }
                }
            }
            console.log(cate[0].products.length);
            res.render('home',{categories: cate,products:product});
        })
    })

}

exports.detail=function (req, res,next){
    Product.find({'_id': req.params["id"]},function (err, products){
        if (err){
            return;
        }

        Comment.find({'product_id':req.params["id"]}).skip(0).limit(10).exec(function (err,comments) {
            if(err) {
                return;
            }


            relativeController.get_relative_product(req.params["id"],function (items) {
                var name;
                if(req.user!=null){
                    name=req.user.name;
                    res.render('product',{product:products, comments:comments, items: items, name: name, type:'disabled'});
                    return;
                }else {
                    res.render('product',{product:products, comments:comments, items: items});
                }

            })

        })


    })
}

exports.search=function (req, res,next) {
    Product.find({'product_name': new RegExp(req.body.name, 'i')},function (err, products){
        if (err){
            return;
        }
        Publisher.find({},function (error,publishers) {
            if(error){
                return;
            }
            Category.find({}, function (err,category) {
                if(err){
                    return;
                }

                res.render('search',{items:products,publisher:publishers, publishers:publishers, categories:category} );
            })

        });

    })
}

exports.extrasearch=function (req, res,next) {
    Product.find({$and:[{'product_name': new RegExp(req.body.name, 'i')}, {publisher_id:req.body.publisher}, {category_id:req.body.category}, {price: JSON.parse(req.body.price)}]},function (err, products){
        if (err){
            return;
        }
        Publisher.find({},function (error,publishers) {
            if(error){
                return;
            }
            Category.find({}, function (err,category) {
                if(err){
                    return;
                }

                res.render('search',{items:products,publisher:publishers, publishers:publishers, categories:category} );
            })

        });

    })
}