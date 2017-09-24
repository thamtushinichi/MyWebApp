var express = require('express');
var router = express.Router();
var produtController=require("../controller/productController");
var commentController=require("../controller/commentController");
var categoryComtroller=require('../controller/categoryController');
var billController=require('../controller/billController');
var userController=require('../controller/userController');
/* GET home page. */


router.post('/checkout',billController.get_checkout);
router.post('/checkout/confirm', billController.confirm_checkout);
router.get('/edit',userController.get_change_infor);
router.post('/edit',userController.change);

router.get('/changepass',userController.get_change_pass);
router.post('/change',userController.change_pass);

router.get('/history',userController.history);
module.exports = router;
