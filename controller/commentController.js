/**
 * Created by Thanh on 6/16/2017.
 */

var Comment=require('../model/comment');
var Product=require('../model/comment');

exports.add=function (req, res, next) {
    var comment=new Comment(
        {
            name: req.body.name,
            detail: req.body.detail,
            product_id:req.body.product_id
        }
    )
    comment.save();
    res.type('text/plain');
    res.json({state:'OK'});

}

exports.show=function (req, res, next) {
    var skip=req.params["skip"];
    var id=req.params["id"];
    Comment.find({product_id:id}).skip(skip-1).limit(10).exec(function (err,comment) {
        if(err){
            res.json({});
            return;
        }
        if(comment!=null) {
            res.json(comment);
        }else {
            res.json({});
        }
    });
}