const nude=require('nude')
const sightengine = require('sightengine')('1581902398','8ZzSgUBkcTLkBzNitRQxxVRrXsVCWNJ2');
const Vendor=require('./../models/vendormodel')
const products=require('./../models/Product')
const VendorAddress=require('./../models/Address(Location)/vendorLocation')
const {promisify}=require('util')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')
const AppError=require('./../utils/appError')
const Email=require('./../utils/email')
const support=require('./../models/support/Support')
const catchAsync=require('./../utils/catchAsync')
const { token } = require('morgan')
const sendEmail = require('./../utils/email')
const orders=require('./../models/OrderModel')
const shop_details=require('./../models/Address(Location)/vendorLocation')
const { STATUS_CODES } = require('http');
const { log } = require('console');
const accountSid="AC565ca0474e2133663cf6a116ca2ef217"
const authToken="7e5ddcf9d8c0ef32ec034f1a9c8ef176"
const client=require("twilio")(accountSid,authToken)
const signToken=id=>{
    return jwt.sign({ id },process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
     })
    
}
const filterObj=(obj,...allowedFields)=>{
    const newObj={}
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el))
        newObj[el]=obj[el]
    })
    return newObj
}

// let Otp,user;
// exports.VendorSignup=async(req,res)=>{
   
//     try{
//         const {name,username,email,number}=req.body
//          user=req.body
//         const existingvendor=await Vendor.findOne({number})
//         if(existingvendor)
//         {
//             res.status(400).json({
//                 msg:"Vendor with this mobile number exists"
//             })
//         }
//         let digits="0123456789"
//         Otp=""
//         for(let i=0;i<4;i++)
//         {
//             Otp+=digits[Math.floor(Math.random()*10)]
//         }
//         console.log(Otp)
//     //     await client.messages.create({
//     //         body:`Your otp verification for user ${username} is ${Otp}`,
//     //         messagingServiceSid:"MG30076f025dc377d03a3cb7cb2a168026",
//     //         to:"+917338427124"
//     //     })
//     //    // .then(()=>res.status(200).json({msg:"Message sent"}))
//     //     .done();
//     client.messages
//     .create({
//                 to: '+917338427124',
//                 body:`Your otp verification for user ${username} is ${Otp}`,
//                messagingServiceSid:'MG30076f025dc377d03a3cb7cb2a168026'
//     })
//     .then(message => console.log(message.sid))
//     .done();
    
//     }catch(e)
//     {
//         res.status(500).json({error:e.message})
//     }
    
// }
// exports.vendorVerify=async(req,res)=>{
//     try{
//         console.log(req.body)
//         const{otp}=req.body
//         if(otp!=Otp)
//         {
//             return res.status(400).json({msg:"Incorrect otp"})
//         }
//        // const token=jwt.sign({})
//        const newVendor=await Vendor.create(user)
//        res.status(200).json({vendor:newVendor})
//        Otp=""
//     }
//     catch(e)
//     {
//         res.status(500).json({error:e.message})
//     }
// }
exports.createVendor=catchAsync(async(req,res,next)=>{
    const vendor=await Vendor.find({email:req.body.email})
    const vendr=await Vendor.find({phone:req.body.phone})
    console.log(vendor.length)
    if(vendor.length>0)
    {
        return next(new AppError('This email already exist',400))
    }
    if(vendr.length>0)
    {
        return next(new AppError('This phone already exist',400))
    }

        
   
        let digits="0123456789"
         Otp=""
        for(let i=0;i<4;i++)
        {
            Otp+=digits[Math.floor(Math.random()*10)]
        }
        console.log(Otp)
        try{
            await sendEmail({
                email:req.body.email,
                //req.body.email,
                subject:'Your otp for  verification is sent',
                message:Otp
            })
            res.status(200).json({
                status:'success',
                message:'Token sent to email',
                otp:Otp

            })}
            catch(err)
            {
            //    vendor.passwordResetToken=undefined
            //    vendor.passResetExpires=undefined
            //    await vendor.save({validateBeforeSave:false})
               return next(new AppError(err.message,500))
        
            }

    
    //  const newVendor=await Vendor.create(req.body);
    //  const token=signToken(newVendor._id)
    // res.status(201).json({
    //     status:'success',
    //     token:token,
    //     data:{
    //         vendor:newVendor

    //     }
    // })
}

)
exports.signupvendor=catchAsync(async(req,res,next)=>{
    const user=await Vendor.find({email:req.body.email})
    const phone=await Vendor.find({phone:req.body.phone})
    //const user=User.find({$or:[{email:req.body.email},{phone:req.body.phone}]})
    console.log(user.length)
    if(user.length>0)
    {
        return next(new AppError('This email already exist',400))
    }
    if(phone.length>0)
    {
        return next(new AppError('This phone number already exist',400))
    }

    const newVendor=await Vendor.create(req.body);
    const token=signToken(Vendor._id)
   res.status(201).json({
       status:'success',
       token:token,
       data:{
           vendor:newVendor
       }
   })
//     if(req.body.isverified)
//     {
       
//     }
//     else
//     {
//         res.status(400).json({
//             status:'fail',
//             message:'otp is incorrect'
            
//         })
        
//     }
// })
// exports.createVendor=catchAsync(async (req,res,next) => {
     
//     const newVendor=await Vendor.create(req.body);
//     const token=signToken(Vendor._id)
//    res.status(201).json({
//        status:'success',
//        token:token,
//        data:{
//            vendor:newVendor

//        }
//    })


})
exports.getallvendors=async(req,res)=>{
    try{
         

//    var a=req.params.name
   
//     var regx=new RegExp(a,'i') //igonre case sensitive
//     console.log(regx)
//     const vendors=await Vendor.find({$or:[{name:{$regex:regx}},{email:{$regex:regx}}]})
    const vendors=await Vendor.find()
    console.log(vendors)
    res.status(200).json({
        status:'success',
        data:{
            results:vendors.length,
            data:{
                vendors
            }

        }
    })
    }catch(err){
    res.status(400).json({
        status:"fail",
        message:err
    })
    
}

}
exports.login=async (req,res,next)=>{
    try{
    const{email,password}=req.body
    if(!email||!password)
    {
        // console.log("Please provide email and password")
        // return  res.status(400).json({
        //     status:'fail',
        //     message:'Please provide email and password'
        // })
        return next(new AppError('Please provide email and password!',400))
    }
    const vendor= await Vendor.findOne({email}).select('+password')
    console.log(vendor)
    console.log(email,password)
    if(!vendor||!(await vendor.correctPassword(password,vendor.password)))
    {
        return next(new AppError('Incorrect Email or Password',401))
    //    return  res.status(400).json({
    //     status:'fail',
    //     message:'Incorrect email or password'
   // })

    }
    const shop=await shop_details.find({vendor_id:vendor._id})
    const token=signToken(vendor._id)
    res.status(200).json({
        status:'success',
        token,
        shop_details:shop,
        vendor_id:vendor._id
    })
}catch(err)
{
    res.status(400).json({
        status:'fail',
        message:err.message
    })
}

}
exports.protect=catchAsync(async(req,res,next)=>{
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
exports.restrictTo=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.vendor.role))
        {
            return next(
                new AppError('You do not have permission to perform this action',403) //403 - prohibited
            )
        } 
        next()
    }
}
exports.forgotPassword=catchAsync(async (req,res,next)=>{
    const vendor=await Vendor.findOne({email:req.body.email})
    if(!vendor)
    {
        return next(new AppError('There is no user with email address',404))
    }
    const resetToken=vendor.createPasswordResetToken()
    await vendor.save({validateBeforeSave:false})
    const reseturl=`${req.protocol}://${req.get('host')}/api/v1/vendor/resetpassword/${resetToken}`
    const message=`Forgot your password ? Submit a Patch request with your new password and confirm password to :
    ${reseturl}.\n If you dint forget your password please ignore it`
    try{
    await sendEmail({
        email:vendor.email,
        //"gagand1902@gmail.com",
        //
        subject:'Your password reset token (valid for 10 mins',
        message
    })
    res.status(200).json({
        status:'success',
        message:'Token sent to email'
    })}
    catch(err)
    {
       vendor.passwordResetToken=undefined
       vendor.passResetExpires=undefined
       await vendor.save({validateBeforeSave:false})
       return next(new AppError(err.message,500))

    }
})
exports.ResetPassword=catchAsync(async (req,res,next)=>{
const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex')
const vendor=await Vendor.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gt:Date.now()}})
if(!vendor)
{
    return next(new AppError('Token is invalid or has  expired',400))
}
vendor.password=req.body.password
vendor.passwordConfirm=req.body.passwordConfirm
vendor.passwordResetToken=undefined
vendor.passwordResetExpires=undefined
await vendor.save()
const token=signToken(vendor._id)
res.status(200).json({
    status:'success',
    token
})
})
const createSendToken=(vendor,statuscode,res)=>{
    const token=signToken(vendor._id)
    const cookieOptions={
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly:true
    }
    if(process.env.NODE_ENV==='production')
    cookieOptions.secure=true

    res.cookie('jwt',token,cookieOptions)
    res.status(statuscode).json({
        status:"success",
        token,
        data:{
            vendor
        }
    })
}
exports.updatePassword=catchAsync(async (req,res,next)=>{
    const vendor=await Vendor.findById(req.vendor.id).select('+password')
    if(!(await vendor.correctPassword(req.body.passwordCurrent,vendor.password))){
    return next(new AppError('Your current password is wrong',401))
    }
    vendor.password=req.body.password
    vendor.passwordConfirm=req.body.confirmpassword
    await vendor.save()
    //vendor.findByIDAndUpdate() function will not work as intended so we used this
    createSendToken(vendor,200,res)

})
exports.updateMe=catchAsync(async (req,res,next)=>{
    if(req.body.password||req.body.passwordConfirm)
    {
        return next(new AppError('This route is not for password updates.Please use /updateMyPassword',400))
    }

    const filterBody=filterObj(req.body,'name','email')
    const updatedVendor=await Vendor.findByIdAndUpdate(req.vendor.id,filterBody,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        status:"success",
        date:{
        vendor:updatedVendor
        }
    })

})

// not actually deleting the vendor disabling active
exports.deletevendor=catchAsync(async (req,res,next)=>{
    await Vendor.findByIdAndUpdate(req.vendor.id,{active:false})
    res.status(204).json({
        status:"success",
        data:null
    })
})

exports.updateVendor=catchAsync(async (req,res,next)=>{
    const vendorUpdate=await Vendor.findByIdAndUpdate(req.vendor.id,filterBody,{
        new:true,
        runValidators:true
    })
    res.status(201).json({
        success:sucess,
        updatedVendor:vendorUpdate
    })
    
})
exports.addVendorAddress=catchAsync(async(req,res,next)=>{
    console.log(req.vendor)
const newAddress=await VendorAddress.create({vendor_id:req.vendor._id,address:req.body.address,shop_name:req.body.shop_name,shop_details:req.body.shop_details,coordinates:req.body.coordinates,shop_timings:req.body.shop_timings,manual_open:req.body.manual_open})
res.status(201).json({
    status:"success",
    Address:newAddress

})
})
exports.getallVendorAddresses=catchAsync(async(req,res,next)=>{
    const addresses=await VendorAddress.find()
    res.status(201).json({
        status:"success",
        addresses:addresses
    })
})
exports.getVendorAddress=catchAsync(async(req,res,next)=>{
    const address=await VendorAddress.find({vendor_id:req.params.id})
//     db.student.find({ $where: function() 
//         { return this.name === "Mickel"; } 
//    })
    console.log(address)
    res.status(201).json({
        vendor_address:address

    })
})
exports.changeEmailOfVendor=catchAsync(async(req,res,next)=>{
    const vendor=await Vendor.findOne({email:req.body.email})
    if(!vendor)
    {
        return next(new AppError('There is no user with email address',404))
    }
    
    let digits="0123456789"
    Otp=""
   for(let i=0;i<4;i++)
   {
       Otp+=digits[Math.floor(Math.random()*10)]
   }
   console.log(Otp)
   try{
       await sendEmail({
           email:req.body.newemail,
           //req.body.email,
           subject:'Your otp for email change is sent',
           message:Otp
       })
       res.status(200).json({
           status:'success',
           message:'Token sent to email',
           otp:Otp

       })}
       catch(err)
       {
       //    vendor.passwordResetToken=undefined
       //    vendor.passResetExpires=undefined
       //    await vendor.save({validateBeforeSave:false})
          return next(new AppError(err.message,500))
   
       }



})
exports.verifyotpforemailchange=catchAsync(async(req,res,next)=>{
if(req.body.isChanged){
    const filterBody=filterObj(req.body,'email')
    const vendorUpdate=await Vendor.findByIdAndUpdate(req.body.vendor,filterBody,{
        new:true,
        runValidators:true
    })
    res.status(201).json({
        success:'success',
        msg:"Email Updated",
        vendor:vendorUpdate
    })
    
}
else
{
    return next(new AppError('OTP is wrong',404))
}
})

exports.updateLocationAddress=catchAsync(async(req,res,next)=>{
    const filterBody=filterObj(req.body,'address','shop_name','shop_details','coordinates')
    const address=await VendorAddress.updateOne({vendor_id:req.params.id},filterBody,{
        new:true,
        runValidators:true

    })
    
    res.status(201).json({
        success:"success",
        vendor_address:address

    })
    

})
exports.shopmanualopenclose=catchAsync(async(req,res,next)=>{
    const shop_openclosemanual=await VendorAddress.updateOne({vendor_id:req.vendor.id},{manual_open:req.body.openorclose},{
        new:true,
        runValidators:true
    }) 
    if(shop_openclosemanual)
    {
        res.status(200).json(
            {
                status:'success',
                message:'shop status updated'
            }
        )
    }
    else
    {
        return next(new AppError('Problem occured',400))
    }
})
exports.getproductssearch=catchAsync(async(req,res,next)=>{
    var a=req.params.search
    let productsss;
   
    var regx=new RegExp(a,'i') //igonre case sensitive 
   //console.log(regx)//
   if(req.params.search===' ')
    {
     productsss=await products.find({vendor_id:req.vendor.id})
    }
    else
    {
        productsss=await products.find({$and:[{title:{$regex:regx}},{vendor_id:req.vendor.id}]})
    }
   res.status(200).json({
    status:'success',
    length:productsss.length,
    products:productsss,
    
   })

})
exports.getproducts=catchAsync(async(req,res,next)=>{
   
//    var a=req.query.search
//    var regx=new RegExp(a,'i') 
//    const productsss=await products.find({$and:[{title:{$regex:regx}},{vendor_id:req.vendor.id}]})
   const productss=await products.find({vendor_id:req.vendor.id})
   res.status(200).json({
    status:'success',
    size:productss.length,
    products:productss
   })

})
exports.getOrderdetails=catchAsync(async(req,res,next)=>{
    const order=await orders.find()
    return order
})
exports.getCompletedorders=catchAsync(async(req,res,next)=>{
    const orderss=await orders.find({vendor_id:req.params.vendor_id},{order_completed:true})
    res.status(200).json({
        status:'success',
        orders:orderss
    })
})
exports.showcurrentorrders=catchAsync(async(req,res,next)=>{
    const curorders=await orders.find({vendor_id:req.params.vendor_id},{order_completed:false},{order_cancelled:false})
    res.status(200).json({
        status:'success',
        orderss:curorders
    })
})
exports.productgiventopartner=catchAsync(async(req,res,next)=>{
    const updateorders=await orders.findByIdAndUpdate(req.body.order_id,{items_given_to_dp:true},{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        status:'success',
        order:updateorders
    })
})
exports.contacttosupport=catchAsync(async(req,res,next)=>{
    const addsupport=await support.create({vendor_id:req.vendor.id,msg:req.body.msg})
    res.status(200).json({
        status:200,
        newsupp:addsupport,
        msg:'Ticket raised'

    })

})
exports.changestatusofproduct=catchAsync(async(req,res,next)=>{
   const status= await products.findByIdAndUpdate(req.params.id,{product_status:req.body.status},{
        new:true,
        runValidators:true
    })
    if(status)
    {
        res.status(200).json({
            status:'success',
            msg:'Product status changed'

        })
    }
    else
    {
        return next(new AppError('Status not changed',400))
    }
})
exports.updatetimingofshop=catchAsync(async(req,res,next)=>{
    const getAdress=await VendorAddress.find({vendor_id:req.vendor.id})
    const updatetime=await VendorAddress.findByIdAndUpdate(getAdress._id,{shop_timings:req.body.timings},{
        new:true,
        runValidators:true
    })
    if(updatetime)
    {
        res.status(200).json({
            status:'success',
            msg:'Time updated'
        })
    }
    else
    {
        return next(new AppError('Not updated',400))
    }
})

exports.nudecheck=catchAsync(async(req,res,next)=>{
    var image=''
    sightengine.check(['nudity','genai']).set_url('https://sexyphoto.es/wp-content/uploads/2020/12/hot-teens-nude-teens-teen-ass-teen-boobs-sexyphotos_28-712x900.jpg').then(function(result) {
        console.log(result)
  // The result of the API
}).catch(function(err) {
    console.log(err)
  // Error
});

    

})