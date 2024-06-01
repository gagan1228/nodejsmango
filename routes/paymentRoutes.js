const express=require("express")
const paymentController=require('./../controllers/phonepe')
const router=express.Router();
router.route('/pay').get(paymentController.getpay)
router.route('/').get(paymentController.phonepe)
module.exports=router;
