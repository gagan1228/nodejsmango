const playlist=require('./../models/playlistModel')
const products=require('./../models/Product')
const Vendor=require('./../models/vendormodel')
const jwt=require('jsonwebtoken')
const catchAsync=require('./../utils/catchAsync')
const clothesSize=require('./../models/size/clothesSize')
const payments=require('./../models/Payments/payments')
const {promisify}=require('util')
const footSize=require('./../models/size/FootwearSize')
const ColorName=require('./../models/var/ColorName')
const ColorSizeClothes=require('./../models/var/ColorSizeClothes')
const ColorSizeShoes=require('./../models/var/ColorSizeShoes')
const Reviews=require('./../models/Reviews')
const Material=require('../models/var/material')
const AppError = require('../utils/appError')
const likeditems=require('./../models/likeditems')
const errorController = require('./errorController')
const createembedding=require('./../utils/createEmbeddings')
const fs=require('fs')
const filterObj=(obj,...allowedFields)=>{
    const newObj={}
    Object.keys(obj).forEach(el=>{
        if(!allowedFields.includes(el))
        newObj[el]=obj[el]
    })
    return newObj
}
const retrievehour=(a,i)=>{
    let b=[];
    for(let k=0;k<a[0].length;k++)
        {
           if(a[i][k]===':')
           {
            //console.log(a[0][k])
            const m1=a[i].substring(k+1)
            const h1=a[i].substring(0,k)
            b.push(h1,m1)
           // console.log(a[0].substring(k+1))//minutes
           // console.log(a[0].substring(0,k))//hours
           }

        }
        return b

}
exports.protect=catchAsync(async(req,res,next)=>{
    console.log('hdsgajgadsj')
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        token=req.headers.authorization.split(' ')[1]
    }
    console.log(token)
    if(!token)
    {
        return next(new AppError('You are not logged in Please log in to get access',401))
    }
    const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    console.log(decoded)
    console.log(decoded.id)
    const freshVendor=await Vendor.findById(decoded.id)
   console.log(freshVendor)
    if(!freshVendor)
    {
        return new AppError('The user belonging to this token does no longer exist',401)
    }
    if(freshVendor.changedPasswordAfter(decoded.iat))
    {
        return next(new AppError('User recently changed password! Please login again',401))
    }
     req.vendor=freshVendor
    next()
})

exports.createPlaylist=catchAsync(async(req,res,next)=>{
    console.log(req.vendor)
    const newplaylist=await playlist.create({name:req.body.name,vendor_id:req.vendor.id})
    res.status(200).json({
        status:'success',
        data:{
            playlist:newplaylist

        }
    })
})
exports.getAllPlaylists=catchAsync(async(req,res,next)=>{
   // console.log(req.vendor)
     const allplaylist=await playlist.find({vendor_id:req.vendor._id})
     res.status(200).json({
        status:'success',
        data:{
            playlists:allplaylist
        }
     })
})
exports.createproduct=catchAsync(async(req,res,next)=>{
    const newproduct=await products.create(req.body)
    res.status(200).json({
        status:'success',
        data:{
            newproduct:newproduct
        }
    })
})
exports.getAllProducts=catchAsync(async(req,res,next)=>{
    //const gparentcategory=await gparentCategory.find().populate({path:'categories',populate:{path:'subcategories'}})
    console.log("hello all pro")
    const productss=await products.find().populate({path:'variations'}).populate('loc')//.populate('shop_address')
    res.status(200).json({
        status:'success',
        data:{
            products:productss
        }
    })
    

})
exports.createvariations=catchAsync(async(req,res,next)=>{
    const variation=await variations.create(req.body)
    res.status(201).json({
        status:'success',
        data:{
            variaton:variation
        }
    })
})
exports.getallvariations=catchAsync(async(req,res,next)=>{
    const variationss=await variations.find()
    res.status(201).json({
        status:'success',
        data:{
            variations:variationss
        }
    })
})
exports.createclothesSize=catchAsync(async(req,res,next)=>{
    const clothessize=await clothesSize.create(req.body)
    res.status(201).json({
        status:'success',
        data:{
            clothessize:clothessize
        }
    })
})
exports.createfootSize=catchAsync(async(req,res,next)=>{
    const footsize=await footSize.create(req.body)
    res.status(201).json({
        status:'success',
        data:{
            footSizee:footsize
        }
    })
})
exports.getclothesSize=catchAsync(async(req,res,next)=>{
    const clothesSizes=await clothesSize.find()
    res.status(201).json({
        status:'success',
        data:{
            clothesSize:clothesSizes
        }
    })
})
exports.getfootSize=catchAsync(async(req,res,next)=>{
    const footSizes=await footSize.find()
    res.status(201).json({
        status:'success',
        data:{
            footSize:footSizes
        }
    })
})


exports.addColorNameVariation=catchAsync(async(req,res,next)=>{
const colorNameVariation=await ColorName.create(req.body)
res.status(201).json({
    status:'success',
    data:{
        newVariation:colorNameVariation
    }
})
})
exports.addColorSizeClothes=catchAsync(async(req,res,next)=>{
    const colorSizeClothes=await ColorSizeClothes.create(req.body)
    res.status(201).json({
        status:'success',
        data:{
            newVariation:colorSizeClothes
        }
    })
})
exports.addColorSizeShoes=catchAsync(async(req,res,next)=>{
    const colorSizeShoes=await ColorSizeShoes.create(req.body)
    res.status(201).json({
        status:'success',
        data:{
            newVariation:colorSizeShoes
        }
    })
})
exports.addMaterial=catchAsync(async(req,res,next)=>{
    const material=await Material.create(req.body)
    res.status(201).json({
        status:'success',
        data:{
            newVariation:material
        }
    })
})
exports.addProductToVendor=catchAsync(async(req,res,next)=>{

    const filterBody=filterObj(req.body,'variations')
    let a=filterBody
    let c=[]
    a.vendor_id=req.vendor.id
   const newprod=await products.create(a)
    let p_id=newprod._id
   console.log(filterBody)
    
    console.log(a)
    let varr=req.body.variations
    
    for(var i=0;i<varr.length;i++)
    {
        varr[i].product_id=p_id
    }
    console.log(varr)
    const addvar=await ColorName.insertMany(varr)
    console.log(addvar)
    for(var j=0;j<addvar.length;j++)
    {
        c.push(addvar[j]._id)
    }
    console.log(c)
    await products.findByIdAndUpdate(p_id,{variations:c},{
        new:true,
        runValidators:true
    })
    // const product=await products.create(a)
    res.status(201).json({
        status:"success",
        newProduct:newprod
    })
})
exports.getProducts=catchAsync(async(req,res,next)=>{
    const productss=await products.find()
    res.status(200).json({
        status:'success',
        allproducts:productss
    })
})
exports.deleteProduct=catchAsync(async(req,res,next)=>{
    console.log(req.params.id)
   
    const del=await products.deleteOne({_id:req.params.id})
    if(del.deletedCount===1)
    {
        res.status(201).json({
            status:"success",
            msg:"Product deleted"
        })
    }
    else
    {
       return next(new AppError('Product not deleted',400))
    }
    

 
})
exports.updateProduct=catchAsync(async(req,res,next)=>{
    //const filterBody=filterObj(req.body,'_id')//not including _id
    const ProductUpdate=await products.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    if(ProductUpdate)
    {

    res.status(201).json({
        success:'success',
        msg:"Product updated",
        updateProduct:ProductUpdate
    })}
    else
    {
        return next(new AppError('Product not updated',400))
    }
})
exports.Catelog=catchAsync(async(req,res,next)=>{
    
    var a=req.params.search
   
     var regx=new RegExp(a,'i') //igonre case sensitive 
    console.log(regx)
    const productsss=await products.find({$or:[{title:{$regex:regx}},{product_id:{$regex:regx}}]})
    res.status(200).json({
        success:'success',
        products:productsss
})
})

exports.getcategoriesforproduct=catchAsync(async(req,res,next)=>{
    const values=JSON.parse(fs.readFileSync(`${__dirname}/response.json`))
    console.log(values)
    res.status(200).json({
        reponse:values.data.gparentcategory[0].categories[0].name
    })

})
exports.addcolornamevariation=catchAsync(async(req,res,next)=>{
    const addcolorname=await ColorName.create(req.body)
    res.status(201).json({
        success:"success",
        colorname:addcolorname
    })
})
exports.getcolornamevariation=catchAsync(async(req,res,next)=>{
    const getcolornamevariations=await ColorName.find({product_id:req.params.id})
    res.status(201).json({
        success:"success",
        colornamevariations:getcolornamevariations
    })
})

exports.getProductswithin12=catchAsync(async(req,res,next)=>{
     var a=req.body.search
   
     var regx=new RegExp(a,'i') //igonre case sensitive 
    console.log(regx)
    const productsss=await products.find({$or:[{title:{$regex:regx}},{product_id:{$regex:regx}}]})
    const {distance,latlng,unit}=req.params
    const [lat,lng]=latlng.split(',')
    const radius=unit==='mi'?distance/3963.2:distance/6378.1
    if(!lat||!lng)
    {
        next(new AppError('Please provide latutude and longitude in format lat,lng',400))
    }
    console.log(distance,lat,lng,unit,radius)
    const productss=await products.find({
        $and:[{loc:{$geoWithin:{$centerSphere:[[lat,lng],radius]}}},{status:true},{title:{$regex:regx}}]
        
    })
    
    res.status(200).json({
        status:'success',
        data:productss
    })
})
exports.addreview=catchAsync(async(req,res,next)=>{
    const newreview=await Reviews.create({user_id:req.user._id,product_id:req.body.product_id,rating:req.body.rating,reviewMessage:req.body.reviewMessage})
    await products.updateOne({_id:req.body.product_id},{$push:{Reviews:newreview}})
    res.status(201).json({
        status:'success',
        review:newreview

    })
})
exports.getreviews=catchAsync(async(req,res,next)=>{
    const getreviews=await Reviews.find({product_id:req.params.product_id})
    res.status(201).json({
        status:'success',
        reviews:getreviews

    })
})
exports.deletevariation=catchAsync(async(req,res,next)=>{
    await products.findByIdAndUpdate(
        req.params.product_id,
        { $pull:{variations:req.params.id} }
    )
    const del=await ColorName.deleteOne({_id:req.params.id})
    const product=await products.findById(req.params.product_id)
    if(product.variations.length<1)
    {
        await products.findByIdAndDelete(req.params.product_id)
    }
    if(del.deletedCount===1)
    {
        res.status(201).json({
            status:"success",
            msg:"variation Deleted"
        })
    }
    else
    {
       return next(new AppError('Variation not deleted',400))
    }
})
exports.makeproductinactive=catchAsync(async(req,res,next)=>{
    const ProductUpdatestatus=await products.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    if(ProductUpdatestatus)
    {

    res.status(201).json({
        success:'success',
        msg:"Product status updated",
        updateProduct:ProductUpdatestatus
    })}
    else
    {
        return next(new AppError('Product not updated',400))
    }
})
exports.makeallproductsinactive=catchAsync(async(req,res,next)=>{
    const makeshopsproductinactive=await products.updateMany({vendor_id:req.vendor.id},{status:req.body.status},{
        new:true,
        runValidators:true
    })
    console.log(makeshopsproductinactive)
    if(makeshopsproductinactive)
    {
        res.status(201).json({
            success:'success',
            msg:"Shops status updated"
        })
    }
    else
    {
        return next(new AppError('Not updated',400))
    }
})
exports.automaticaccordingtotimings=catchAsync(async(req,res,next)=>{
    let latlng=req.params.latlng
   // const getproducts=await products.find()
    const [lat,lng]=latlng.split(',')
    const radius=12/6378.1// 12 is a distance in km
    const getproducts=await products.find({
        $and:[{loc:{$geoWithin:{$centerSphere:[[lat,lng],radius]}}}]
        
    })
    //const get=await getproducts.select('vendor_id._id')
   //console.log(getproducts.length)
   // let js=JSON.stringify({data:getproducts})
    // console.log(js)
    // console.log(js[0].data)
    
    res.status(200).json({
        data:getproducts
    })
    let b=[]
    for(let i=0;i<getproducts.length;i++)
    {   //console.log(i)
        
        let a=getproducts[i].shop_address.shop_timings
        //console.log(a[0].length)
        //console.log(a[0])
        const open=retrievehour(a,0)
        const close=retrievehour(a,1)
        console.log(open[0])
        console.log(open[1])
        console.log(retrievehour(a,0))
        console.log(retrievehour(a,1))
        const dateTimeObject=new Date()
        console.log(dateTimeObject.getHours())
        if(dateTimeObject.getHours()>open[0]&&dateTimeObject.getHours()<close[0])
        {
            console.log(true)
            b.push(getproducts[i])

        }
        else if(dateTimeObject.getHours()===open[0]&&dateTimeObject.getHours()===close[0])
        {
            if(dateTimeObject.getMinutes()>open[1]&&dateTimeObject.getMinutes()<close[1])
            {
                console.log(true)
                b.push(getproducts[i])
            }
        }
        else
        {
            console.log('false as f')
        }
        
        
    }
   
   console.log(b)
   console.log(b.length)
    // console.log(`Datee: ${dateTimeObject.toDateString()}`);
    // console.log(`Time: ${dateTimeObject.toTimeString()}`);
    //  console.log(dateTimeObject.getHours())
    //  console.log(dateTimeObject.getMinutes())
    // console.log(dateTimeObject.getDay())
    //console.log(dateTimeObject.getHours()>=h1&&dateTimeObject.getMinutes()>m1)
   

})
exports.updatevariation=catchAsync(async(req,res,next)=>{
    const updatevar=await ColorName.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    }) 
    if(updatevar)
    {
        res.status(200).json({
            status:'success',
            message:'Update completion'

        })
    }
    else
    {
        return next(new AppError('Not updated',400))
    }
})
exports.setproductstatus=catchAsync(async(req,res,next)=>{
    const setproduct=await products.findByIdAndUpdate(req.params.id,{status:req.body.status},{
        new:true,
        runValidators:true
    })
    if(setproduct)
    {
        res.status(200).json({
            status:'success',
            message:'Update completion'
        })
    }
    else
    {
       return(next(new AppError('product status not updated',400)))
    }
})
exports.addsumnepayments=catchAsync(async(req,res,next)=>{
    const addpayments=await payments.create(req.body)
    res.status(200).json({
        status:'success',
        paym:addpayments
    })
})
exports.getpayments=catchAsync(async(req,res,next)=>{
    const paym=await payments.find()
    res.status(200).json({
        status:'success',
        payments:paym
    })
})
exports.getbarivendorpayments=catchAsync(async(req,res,next)=>{
    const getbarivendor=await payments.find({vendor_id:{$exists:true}})
    res.status(200).json({
        status:'success',
        paymen:getbarivendor

    })
})
exports.getvariationsofproductss=catchAsync(async(req,res,next)=>{
    const getvar=await ColorName.find({product_id:req.params.id})
    res.status(200).json({
        status:'success',
        var:getvar

    })
})
exports.getproductsasnow=catchAsync(async(req,res,next)=>{
    const getproducts=await products.find()
    res.status(200).json({
        status:'success',
        pro:getproducts
    })
})