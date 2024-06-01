const express=require("express")
const dpartnerController=require('./../controllers/deliveryPartnerController')
const router=express.Router();
router.route('/signup').post(dpartnerController.createDeliveryPartner)
router.route('/verifysignup').post(dpartnerController.signuppartner)
router.route('/getdp').get(dpartnerController.protect,dpartnerController.getalldp)
router.route('/login').post(dpartnerController.login)
//router.route('/newuserverify').post(dpartnerController.vendorVerify)
router.route('/forgotpassword').post(dpartnerController.forgotPassword)
router.route('/resetpassword/:token').post(dpartnerController.ResetPassword)
//router.route('/changeEmail').post(dpartnerController.protect,dpartnerController.changeEmailOfVendor)
//router.route('/verifychangeEmail').patch(dpartnerController.protect,dpartnerController.verifyotpforemailchange)
router.route('/updateMyPassword').patch(dpartnerController.protect,dpartnerController.protect,dpartnerController.updatePassword)
router.route('/updateMe').patch(dpartnerController.protect,dpartnerController.updateMe)
router.route('/deletedp').delete(dpartnerController.protect,dpartnerController.deleteDeliverypartner)
// router.route('/vendor_address').post(dpartnerController.protect,dpartnerController.addVendorAddress).get(dpartnerController.getallVendorAddresses)
// router.route('/vendorAddress/:id').get(dpartnerController.protect,dpartnerController.getVendorAddress)

module.exports=router;

