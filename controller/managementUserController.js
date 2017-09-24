

var userModel= require('../model/users');
var bcrypt=require('bcrypt-nodejs');

exports.loadpage=function (req,res,next) {
    res.render('user/management_user_page',{layout:'layoutadmin'});
};
exports.adduser=function (req,res,next) {
    res.render('user/adduser',{layout:'layoutadmin'});
};
exports.adduserpost=function (req,res,next) {
    var newUser = {
        username: req.body.username,
        password: req.body.password,
        name: req.body.fullname,
        email:req.body.email,
        role_id: req.body.role_id
    };
    var userName=req.body.username;
    newUser.password=bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(5),null);
    var userData=new userModel(newUser);


    userModel.findOne({'username': userName},function (err,user) {
        if(err)
        {
            console.log(err);
            //xử lí khi gặp lỗi ở đây
            res.redirect('/admin/user/listuser');
            return;
        }
        if(!user)
        {
            userData.save();
            res.render('user/adduser',{layout:'layoutadmin'
                ,message: 'Bạn đã thêm thành công'});
            return;
        }
        res.render('user/adduser',{layout:'layoutadmin'
            ,message: 'Username đã có trong hệ thống'});
        return;
    });
};
exports.listuser=function (req,res,next) {
    userModel.find({},function (err, users){
        if (err){
            res.render('user/management_user_page',{layout:'layoutadmin'});
            return;
        }
        var userTemp=users;
        var userList= [];
        for(var i=0;i<userTemp.length;i++)
        {
            var userArray={
                id: userTemp[i]._id,
                username: userTemp[i].username,
                password: userTemp[i].password,
                name: userTemp[i].name,
                email: userTemp[i].email,
                role_id: userTemp[i].role_id,
                role_name: ''
            };
            switch (userTemp[i].role_id)
            {
                case 1:
                    userArray.role_name='admin';
                    userList.push(userArray);
                    break;
                case 2:
                    userArray.role_name='user';
                    userList.push(userArray);
                    break;

                default:
                    userArray.role_name='unknown';
                    userList.push(userArray);

                    break;
            }

        }
        res.render('user/listuser',{items:userList,layout:'layoutadmin'});
    });
};
exports.lockuser=function (req,res,next) {
    var id= req.params.id;
    userModel.findOne({'_id': id},function (err,user) {
        if(err)
        {
            console.log(err);
            //xử lí khi gặp lỗi ở đây
            res.redirect('/admin/user/listuser');
            return;
        }
        if(!user)
        {
            console.log(err);
            //xử lí khi gặp lỗi ở đây
            res.redirect('/admin/user/listuser');
            return;
        }
        user.role_id='0';
        user.save();
        res.redirect('/admin/user/listuser');
        return;
    });
};
exports.seedetailuser=function (req,res,next) {

};
exports.updateuser=function (req,res,next) {
    var id= req.params.id;
    userModel.findOne({'_id': id},function (err,user) {
        if(err)
        {
            console.log(err);
            //xử lí khi gặp lỗi ở đây
            res.redirect('/admin/user/listuser');
            return;
        }
        var userArray={
            id: user._id,
            username: user.username,
            password: user.password,
            name: user.name,
            email: user.email,
            role_id: user.role_id,
            role_name: ''
        };
        switch (user.role_id)
        {
            case 1:
                userArray.role_name='admin';

                break;
            case 2:
                userArray.role_name='user';

                break;

            default:
                userArray.role_name='unknown';
                break;
        }
        res.render('user/updateuser',{layout:'layoutadmin',item:userArray});
        return;
    });
};
exports.updateuserpost=function (req,res,next) {
    var checkPassOptions= (req.body.passwordOptions);
    var id= req.params.id;

    userModel.findOne({'_id': id},function (err,user) {
        if (err) {
            console.log(err);
            //xử lí khi gặp lỗi ở đây
            res.redirect('/admin/user/listuser');
            return;
        }
        //neu co tick vao reset password
        if(checkPassOptions =='true')
        {
            user.name=req.body.fullname;
            user.role_id=req.body.role_id;
            user.email=req.body.email;
            user.password=bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(5),null);
            user.save();
            res.redirect('/admin/user/listuser');
            return;
        }
        //nguoc lai khong tick thi
        if(!checkPassOptions)
        {
            user.name=req.body.fullname;
            user.role_id=req.body.role_id;
            user.email=req.body.email;
            user.save();
            res.redirect('/admin/user/listuser');
            return;
        }
        if(!user)
        {
            res.redirect('/admin/user/listuser');
            return;
        }
    });

};