const express=require("express")
const CategoryController=require('./../controllers/categoryController')
const router=express.Router();
router.route('/').post(CategoryController.creategparentcat).get(CategoryController.getcataccordingtogparent);
//router.route('/:id').get(CategoryController.getCategory)

module.exports=router;

