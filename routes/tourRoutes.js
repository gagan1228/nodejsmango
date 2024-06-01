const express=require("express")
const tourController=require('./../controllers/tourController')
const vendorAuthController=require('./../controllers/vendorController')
const router=express.Router();
router.route('/top-2-tours').get(tourController.aliasTopTours , tourController.getAllTours);
router.route('/').get(vendorAuthController.protect,tourController.getAllTours).post(tourController.createTour);
router.route('/:id').get(vendorAuthController.protect, vendorAuthController.restrictTo('admin'),tourController.getTour).patch(tourController.updateTour);
module.exports=router;

