const express=require("express")
const userController=require('./../controllers/userController')
const router=express.Router();
// router.route('/top-2-tours').get(tourController.aliasTopTours , tourController.getAllTours);
// router.route('/').get(tourController.getAllTours).post(tourController.createTour);
// router.route('/:id').get(tourController.getTour).patch(tourController.updateTour);
//router.route('/signup').post(userController.createUser)
router.route('/sendotpmail').post(userController.sendmail)
router.route('/usersignup').post(userController.signupuser)
router.route('/googleauth').post(userController.signuporloginwithgoogle)
router.route('/forgotpassword').post(userController.forgotPassword)
router.route('/resetpassword/:token').post(userController.ResetPassword)
router.route('/loginuser').post(userController.login)
router.route('/likeditems').post(userController.addlikedproducts)
router.route('/likeditems/:id').get(userController.getlikedproducts).delete(userController.deleteLikedItems)
router.route('/cart').post(userController.protect,userController.secondcart)
router.route('/cart/alterqty/:id').post(userController.protect,userController.increaseqty)
router.route('/cart/carticonclick').post(userController.protect,userController.carticonclick)
// Orders
router.route('/orders').post(userController.protect,userController.addOrder)
//Address
router.route('/address').post(userController.protect,userController.storeaddress)
router.route('/productsorder').post(userController.protect,userController.productsorder)

router.route('/deletegekko').delete(userController.deleteaddressesgekko)
router.route('/sendsms').post(userController.protect,userController.verifyphone)
router.route('/getproductdetails/:id').get(userController.productsdetailspage)
router.route('/selectsize/:id/:name/:size').get(userController.selectsize)
router.route('/checkt').post(userController.timingsbool)
router.route('/otpless').post(userController.otpless)
router.route('/otpverify').post(userController.verifyotpless)
router.route('/allproducts').get(userController.getallproducts)
module.exports=router;

