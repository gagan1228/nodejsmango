const ApiFeatures=require('./../utils/apifeatures')
const Category=require('./../models/categoryModel')
const subcategory=require('./../models/subcategoryModel')
const gparentcategory=require('./../models/gparentcatModel')
const catchAsync=require('./../utils/catchAsync')
const gparentCategory = require('./../models/gparentcatModel')

exports.createCategory = async(req,res)=>{
    try
    {
     const newCategory=await Category.create(req.body);
     await gparentcategory.updateOne({name:req.body.gparentcat},{$push:{categories:newCategory._id}})
    res.status(201).json({
        status:'success',
        data:{
            category:newCategory

        }
    })
    }catch(err){
    res.status(400).json({
        status:"fail",
        message:err
    })
    
}

}
exports.getallCategory =async (req,res)=>{
    try
    {
     const category=await Category.find();
    res.status(200).json({
        status:'success',
        data:{
          category
        }
    })
    }catch(err){
    res.status(400).json({
        status:"fail",
        message:err
    })
    
}

}
exports.createsub = async (req,res) =>{
    try
    {
     const newsubcat=await subcategory.create(req.body);
     await Category.updateOne({name:req.body.category},{$push:{subcategories:newsubcat._id}})
     
    res.status(201).json({
        status:'success',
        data:{
            subcategory:newsubcat

        }
    })
    }catch(err){
    res.status(400).json({
        status:"fail",
        message:err
    })
    
}
}
exports.getallsubcat =async (req,res)=>{
    try
    {
     const subcat=await subcategory.find();
    res.status(200).json({
        status:'success',
        length:subcat.length,
        data:{
          subcat
        }
    })
    }catch(err){
    res.status(400).json({
        status:"fail",
        message:err
    })
    
}

}
exports.getCategory =async (req,res)=>{
    try
    {
     const category=await Category.findById(req.params.id);
    res.status(200).json({
        status:'success',
        data:{
          category
        }
    })
    }catch(err){
    res.status(400).json({
        status:"fail",
        message:err
    })
    
}

}
exports.getsubcat =async (req,res)=>{
    try
    {
     const subcat=await subcategory.findById(req.params.id);
    res.status(200).json({
        status:'success',
        data:{
          subcat
        }
    })
    }catch(err){
    res.status(400).json({
        status:"fail",
        message:err
    })
    
}

}
exports.creategparentcat=catchAsync(async(req,res,next)=>{
    const gparentcat=await gparentcategory.create(req.body)
    res.status(200).json({
        status:'success',
        data:{
            gparentcat:gparentcat

        }
    })
})
exports.getcataccordingtogparent=catchAsync(async (req,res,next)=>{

   // const gparentcategory=await gparentCategory.find().populate('categories')
   //const gparentcategory=await gparentCategory.find().populate({path:'categories',populate:{path:'subcategories'}})
   const gparentcat=await gparentCategory.find()
    res.status(200).json({
        status:"success",
        data:{
            gparentcategory:gparentcat
        }
    })
})
exports.getcategoryaccordingtoparent=catchAsync(async(req,res,next)=>{
    const categoriess=await Category.find({gparentcat:req.params.gparent})
    res.status(201).json({
        status:'success',
        categories:categoriess
    })
})
exports.getsubcategoriesaccordingtocategory=catchAsync(async(req,res,next)=>{
    const subcategoriess=await subcategory.find({category:req.params.category})
    res.status(201).json({
        status:'success',
        subcategories:subcategoriess
    })
})