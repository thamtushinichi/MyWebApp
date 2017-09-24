/**
 * Created by Thanh on 6/26/2017.
 */
var User=require('../model/users');
var Bill=require('../model/bill');
var BillDetail=require('../model/bill_detail');
var Product=require('../model/product');
var bcrypt=require('bcrypt-nodejs');
var nodemailer=require('nodemailer');

exports.get_change_infor=function (req, res, next) {
    User.findOne({_id:req.user._id},function (err, user) {
        if(err){
            return;
        }

        res.render('change',{user: user});
    });
}

exports.change=function (req, res, next) {
    User.findOne({_id:req.user._id},function (err, user) {
        if(err){
            return;
        }
        user.name=req.body.name;
        user.email=req.body.email;
        user.save();
        res.redirect('/');
    });
}

exports.get_change_pass=function (req, res, next) {
    res.render('changepass');
}

exports.change_pass=function (req, res, next) {
    User.findOne({_id:req.user._id},function (err,user) {
        if(err){
            return;
        }
        if(req.body.newpassword!=req.body.repeat){
            res.render('changepass',{notice:'Mật khẩu nhập lại không khớp'});
            return;
        }
        if(bcrypt.compareSync(req.body.oldpassword,user.password)) {
            user.password = bcrypt.hashSync(req.body.newpassword, bcrypt.genSaltSync(5), null);
            user.save();
            res.redirect('/');
        }else {
            res.render('changepass',{notice:'Mật khẩu cũ không đúng'});
        }

    })
}

exports.history=function (req, res, next) {

    Bill.find({user_id: req.user._id},function (err, bills) {
        if(err){
            return;
        }
        if(bills.length==0){
            res.render('history');
            return;
        }
        var condition=[];
        for(var i=0;i<bills.length;i++){
            condition.push({"bill_id": bills[i]._id});
        }

        BillDetail.find({$or:condition}, function (err, billdetails) {
            if(err){
                return;
            }
            condition=[];
            for(var i=0;i<billdetails.length;i++){
                condition.push({"_id": billdetails[i].product_id});
                for(var j=0;j<bills.length;j++){
                    if(billdetails[i].bill_id==bills[j]._id){
                        billdetails[i].bill_id=bills[j].status_of_bill;
                        billdetails[i].date=bills[j].date_of_bill;
                    }
                }
            }

            Product.find({$or:condition},function (err,products) {
                if(err){
                    return;
                }
                var pro=[];
                for(var j=0;j<billdetails.length;j++){
                    for(var i=0;i<products.length;i++){
                        if(products[i]._id==billdetails[j].product_id){
                            if(billdetails[j].bill_id=="2") {
                                products[i].status = "Đã giao";
                            }else {
                                if(billdetails[j].bill_id=="0") {
                                    products[i].status = "Chưa giao";
                                }else {
                                    products[i].status = "Đang giao";
                                }
                            }

                            products[i].num = billdetails[j].quantity;
                            products[i].date=billdetails[j].date;
                            products[i].price=billdetails[j].total_price;
                            pro.push(products[i]);
                        }

                    }
                }


                res.render('history',{items:pro});
            });


        });
    });
}

exports.confirm=function (req, res, next) {
    User.findOne({'_id':req.params['id']},function (err,user) {
        if(err){
            return;
        }
        user.role_id=2;
        user.save();
        res.redirect('/');
    })
}

exports.forgotpass=function (req, res, next) {
    User.findOne({'username':req.body.username},function (err, user) {
        if(err){
            return;
        }
        var rand=Math.floor((Math.random() * 1000000) + 2);
        user.role_id=rand;
        user.save();
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'phattrienungdungweb17@gmail.com', // Your email id
                pass: 'ptudw2017' // Your password
            }
        });

        var text ='Xin chào '+ user.name+',\n\n'+'Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại trang web store, vui lòng click vào liên kết bên đưới để đặt lại mật khẩu\n\n' +
            'http://'+req.headers.host+"/reset/"+rand+"/"+user._id;

        var mailOptions = {
            from: 'phattrienungdungweb14@gmail.com', // sender address
            to: user.email, // list of receivers
            subject: 'Đặt lại mật khẩu', // Subject line
            text: text //, // plaintext body
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
                res.json({yo: 'error'});
            }else{
                console.log('Message sent: ' + info.response);
                res.json({yo: info.response});
            };
        });

        res.render('home',{show: 'show', notice:'Một liên kết đặt lại mật khẩu đã được gửi đến '+user.email+' vui lòng kiểm tra và xác nhận'});
    });
}

exports.get_reset_page=function (req, res, next) {
    User.findOne({'_id':req.params['id']},function (err,user) {
        if(err){
            return;
        }

        if(user.role_id!=req.params['role']){
            return;
        }
        res.render('resetpass',{id:user._id});

    });
}

exports.reset_pass=function (req, res, next) {
    if(req.body.password!=req.body.repeat){
        res.render('resetpass',{notice:'Mật khẩu nhập lại không khớp',id:req.body.id});
        return;
    }
    User.findOne({'_id':req.body.id},function (err,user) {
        if(err){
            return;
        }
        user.role_id=2;
        user.password=bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(5),null);
        user.save();
        res.render('resetpass',{notice:'Đặt lại mật khẩu thành công',id:req.body.id});
    })
}