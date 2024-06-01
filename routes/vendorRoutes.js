const express=require("express")
const vendorController=require('./../controllers/vendorController')
const router=express.Router();

router.route('/signup').post(vendorController.createVendor)
router.route('/verifysignup').post(vendorController.signupvendor)
router.route('/getvendors').get(vendorController.getallvendors)
router.route('/login').post(vendorController.login)
//router.route('/newuserverify').post(vendorController.vendorVerify)
router.route('/forgotpassword').post(vendorController.forgotPassword)
router.route('/resetpassword/:token').post(vendorController.ResetPassword)
router.route('/changeEmail').post(vendorController.protect,vendorController.changeEmailOfVendor)
router.route('/verifychangeEmail').patch(vendorController.protect,vendorController.verifyotpforemailchange)
router.route('/updateMyPassword').patch(vendorController.protect,vendorController.protect,vendorController.updatePassword)
router.route('/updateMe').patch(vendorController.protect,vendorController.updateMe)
router.route('/deletevendor').delete(vendorController.protect,vendorController.deletevendor)
router.route('/vendor_address').post(vendorController.protect,vendorController.addVendorAddress).get(vendorController.getallVendorAddresses)
router.route('/vendorAddress/:id').get(vendorController.protect,vendorController.getVendorAddress)
router.route('/manualopening').patch(vendorController.protect,vendorController.shopmanualopenclose)
router.route('/getproductsaccsearch/:search').get(vendorController.protect,vendorController.getproductssearch)
router.route('/getproducts').get(vendorController.protect,vendorController.getproducts)
router.route('/getcompletedorders/:vendor_id').get(vendorController.getCompletedorders)
router.route('/statusproduct/:id').patch(vendorController.protect,vendorController.changestatusofproduct)
router.route('/changetimingsshop').patch(vendorController.protect,vendorController.updatetimingofshop)
router.route('/nudecheck').post(vendorController.nudecheck)


module.exports=router;

