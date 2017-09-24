var express = require('express');
var router = express.Router();
var adminController=require('../controller/adminController');
var categoryController=require('../controller/categoryController');
var publisherController=require('../controller/publisherController');
var productForAdminController=require('../controller/productForAdminController');
var managementUserController=require('../controller/managementUserController');
var managementBillController=require('../controller/managementBillController');
/* GET admin home page. */
router.get('/', adminController.page);
/*
 * Category
 */
router.get('/category',categoryController.loadpage);

router.get('/category/listcategory',categoryController.listcategory);

router.get('/category/listcategory/:id?',categoryController.listcategorybyid);

router.get('/category/addcategory',categoryController.addcategory);

router.post('/category/addcategory',categoryController.addcategorypost);
router.get('/category/listcategory/product/:id?/delete',categoryController.deleteProduct);

router.get('/category/listcategory/:id?/update',categoryController.updateCategory);
router.post('/category/listcategory/:id?/update',categoryController.updateCategoryPost);

/*
 * publisher
 */
router.get('/publisher',publisherController.loadpage);

router.get('/publisher/listpublisher',publisherController.listpublisher);

router.get('/publisher/addpublisher',publisherController.addpublisher);

router.post('/publisher/addpublisher',publisherController.addpublisherpost);
router.get('/publisher/listpublisher/:id?/update',publisherController.updatePublisher);
router.post('/publisher/listpublisher/:id?/update',publisherController.updatePublisherPost);

/*
 * Product
 */
router.get('/product',productForAdminController.loadpage);

router.get('/product/listproduct',productForAdminController.listproduct);

router.get('/product/addproduct',productForAdminController.addproduct);

router.post('/product/addproduct',productForAdminController.addproductpost);
router.post('/product/addproduct/addimage/:productName?',productForAdminController.addproductimage);

router.get('/product/listproduct/:id?/update',productForAdminController.updateProduct);
router.post('/product/listproduct/:id?/update',productForAdminController.updateProductPost);

router.get('/product/listproduct/:id?/delete',productForAdminController.deleteProduct);
router.get('/product/listproduct/:id?/detail',productForAdminController.detailProduct);
/*
 * User
 */
router.get('/user',managementUserController.loadpage);
router.get('/user/listuser',managementUserController.listuser);
router.get('/user/adduser',managementUserController.adduser);
router.post('/user/adduser',managementUserController.adduserpost);
router.get('/user/:id?/update',managementUserController.updateuser);
router.post('/user/:id?/updateuser',managementUserController.updateuserpost);
router.get('/user/:id?/lock',managementUserController.lockuser);

/*
 * Bill
 */
router.get('/bill',managementBillController.loadpage);
router.get('/bill/:id?/update',managementBillController.updatebill);
router.post('/bill/:id?/update',managementBillController.updatebillpost);
router.get('/bill/producttop',managementBillController.loadtopproduct);
module.exports = router;
