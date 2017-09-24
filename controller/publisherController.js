

var publisherModel = require('../model/publisher');

exports.loadpage= function (req, res,next){
    res.render('publisher/publisherpage',{layout:'layoutadmin'});
}

exports.listpublisher= function (req, res,next){

    publisherModel.find({},function (err, publishers){
        if (err){
            return;
        }
        res.render('publisher/listpublisher',{items:publishers,layout:'layoutadmin'});
    })

}

exports.addpublisher= function (req, res,next){
    res.render('publisher/addpublisher',{layout:'layoutadmin'});

}
exports.addpublisherpost= function (req, res,next){
    var newPublisher = {
        publisher_name: req.body.publisher_name
    };
    var name=req.body.publisher_name;
    console.log(name);
    var publisherData= new publisherModel(newPublisher);
    publisherModel.findOne({'publisher_name': name},function (err,publisher) {
        if(err)
        {
            console.log(err);
            //xử lí khi gặp lỗi ở đây
            return;
        }
        if(!publisher)
        {
            //chưa có tên category này trong db

            publisherData.save();

            res.render('publisher/addpublisher',{layout:'layoutadmin',message: 'Bạn thêm thành công'});
            return;
        }
        res.render('publisher/addpublisher',{layout:'layoutadmin',message: 'Publisher đã có trong hệ thống'});
        return;
    });

}

exports.updatePublisher=function (req, res,next) {
    var id=req.params.id;

    publisherModel.findOne({'_id': id},function (err,category) {
        if(err)
        {
            console.log(err);
            //xử lí khi gặp lỗi ở đây
            res.render('publisher/publisherpage',{layout:'layoutadmin'});
            return;
        }
        res.render('publisher/publisherupdate',{layout:'layoutadmin',item:category});
        return;
    });
};
exports.updatePublisherPost=function (req, res,next) {
    var id=req.params.id;
    var name=req.body.publisher_name;
    publisherModel.findOne({'_id': id},function (err,categoryroot) {
        if(err)
        {
            res.redirect('/admin/publisher/listpublisher');
            return;
        }
        publisherModel.findOne({'publisher_name': name},function (err,category) {
            if(err)
            {
                console.log(err);
                //xử lí khi gặp lỗi ở đây
                res.redirect('/admin/publisher/listpublisher');
                return;
            }
            if(!category)
            {
                //chưa có tên category này trong db
                console.log('chuan bi');
                categoryroot.publisher_name=name;
                categoryroot.save();
                console.log('chay xong');
                res.render('publisher/publisherupdate',{layout:'layoutadmin',message: 'Bạn thêm publisher thành công',item:categoryroot});
                return;
            }
            res.render('publisher/publisherupdate',{layout:'layoutadmin',message: 'Publisher đã có trong hệ thống',item:categoryroot});
            return;
        });

    });

};