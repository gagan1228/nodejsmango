const express=require("express")
const CategoryController=require('./../controllers/categoryController')
const router=express.Router();
router.route('/').get(CategoryController.getallCategory).post(CategoryController.createCategory);
router.route('/:id').get(CategoryController.getCategory)
router.route('/get/:gparent').get(CategoryController.getcategoryaccordingtoparent)

//router.route('/getonlycategoriesaccordingtoparent').get(CategoryController.getcataccordingtogparent)


module.exports=router;

