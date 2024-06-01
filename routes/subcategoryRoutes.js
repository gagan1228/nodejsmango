const express=require("express")
const CategoryController=require('./../controllers/categoryController')
const router=express.Router();
router.route('/').get(CategoryController.getallsubcat).post(CategoryController.createsub)
router.route('/:id').get(CategoryController.getsubcat)
router.route('/get/:category').get(CategoryController.getsubcategoriesaccordingtocategory)

module.exports=router;

