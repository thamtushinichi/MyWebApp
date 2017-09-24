var express = require('express');
var router = express.Router();
var produtController=require("../controller/productController");
var commentController=require("../controller/commentController");
var categoryComtroller=require('../controller/categoryController');
var billController=require('../controller/billController');
var userController=require('../controller/userController');
var passport=require('passport');

/* GET home page. */
router.get('/', produtController.list);
router.get('/detail/:id',produtController.detail);

router.post('/comment/add',commentController.add);

router.post('/product/search', produtController.search);

router.post('/products/extrasearch', produtController.extrasearch);

router.get('/products/:product', categoryComtroller.get_product);

router.get('/category/:id', categoryComtroller.get_product_by_category);

router.get('/categories/:id/:page', categoryComtroller.get_product_by_category_id);

router.post('/categories/:id/:page', categoryComtroller.get_product_by_condition);

router.post('/plugin', passport.authenticate('login',{
    successRedirect: '/page',
    failureRedirect:'/error'
}));

router.get('/error', function (req, res, next) {
    res.render('home',{show: 'show', notice:req.flash('message')[0]});
})

router.post('/signup', passport.authenticate('signup',{
    successRedirect: '/users',
    failureRedirect:'/error'
}));

router.get('/logout',function (req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

router.get('/page',function (req, res, next) {
    if(req.user.role_id==1){
        res.redirect('/admin');
        return;
    }else {
        res.redirect('/');
    }
});

router.post('/forgot',userController.forgotpass);
router.get('/reset/:role/:id',userController.get_reset_page);
router.post('/reset',userController.reset_pass);
router.get('/comment/:id/:skip',commentController.show);
router.get('/confirm/:id',userController.confirm);
module.exports = router;

