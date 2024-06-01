const express=require("express")
const pController=require('./../controllers/productsController')
const userController=require('./../controllers/userController')
const filesController=require('./../controllers/uploadfilesController')
const vendorController=require('./../controllers/vendorController')
const router=express.Router();
router.route('/playlist').get(pController.protect,pController.getAllPlaylists).post(pController.protect,pController.createPlaylist);
//router.route('/:id').get(CategoryController.getCategory)
//router.route('/getonlycategoriesaccordingtoparent').get(CategoryController.getcataccordingtogparent)
//router.route('/').get(pController.getAllProducts).post(pController.createproduct)
router.route('/variations').post(pController.getcolornamevariation)
router.route('/variations/:id').patch(pController.updatevariation)
router.route('/variation/:id/:product_id').delete(pController.deletevariation)
router.route('/clothesSize').get(pController.getclothesSize).post(pController.createclothesSize)
router.route('/footSize').get(pController.getfootSize).post(pController.createfootSize)
router.route('/addNewColorName').post(pController.addColorNameVariation)
router.route('/addNewColorSizeClothes').post(pController.addColorSizeClothes)
router.route('/addNewColorSizeShoes').post(pController.addColorSizeShoes)
router.route('/addNewMaterialVariation').post(pController.addMaterial)
router.route('/').post(vendorController.protect,pController.addProductToVendor).get(pController.getAllProducts)
router.route('/deleteProduct/:id').delete(pController.deleteProduct)
router.route('/updateProduct/:id').patch(pController.updateProduct)
router.route('/getcatalog/:search').get(pController.Catelog)
router.route('/getcategoriesregx').get(pController.getcategoriesforproduct)
router.route('/variation').post(pController.addColorNameVariation)
router.route('/getvariation/:id').get(pController.getcolornamevariation)

router.route('/products-within/:distance/center/:latlng/unit/:unit').get(pController.getProductswithin12)
//Reviews
router.route('/reviews').post(userController.protect,pController.addreview)
router.route('/reviews/:product_id').get(pController.getreviews)
router.route('/files').post(filesController.uploadphoto)
router.route('/deletevariation/:id/:product_id').delete(pController.protect,pController.deletevariation)
router.route('/updatevariation/:id').patch(pController.protect,pController.updatevariation)
//Make products inactive
router.route('/updateShopsproductsStatus/:id').patch(pController.makeallproductsinactive)
router.route('/updateproductstatus/:id').patch(pController.makeproductinactive)
//Automatic
router.route('/showaccordingtotimings').post(pController.automaticaccordingtotimings)
router.route('/setproductsstatus').patch(pController.protect,pController.setproductstatus)
//sumne idu not serious
router.route('/payments').post(pController.addsumnepayments).get(pController.getpayments)
router.route('/getpaymentsbarivendor').get(pController.getbarivendorpayments)

router.route('/getvariationsforproducts/:id').get(pController.getvariationsofproductss)
router.route('/getproductshomepage/:latlng').get(pController.automaticaccordingtotimings)

//sumne 
router.route('/getpro').get(pController.getproductsasnow)
module.exports=router;

