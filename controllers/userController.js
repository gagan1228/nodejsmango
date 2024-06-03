const User=require('./../models/usermodel')
const userLocation=require('./../models/Address(Location)/userLocation')
const {OAuth2Client}=require('google-auth-library')
const likedItems=require('./../models/likeditems')
const {promisify}=require('util')
const jwt=require('jsonwebtoken')
const support=require('./../models/support/Support')
var cron = require('node-cron');
const crypto=require('crypto')
const vendorController=require('./../controllers/vendorController')
const sendsms=require('./../utils/smstwilio')
const AppError=require('./../utils/appError')
const VendorLocation=require('./../models/Address(Location)/vendorLocation')
const cart=require('./../models/cart')
const products=require('./../models/Product')
const Email=require('./../utils/email')
const Customresponse=require('./../utils/customresponse')
const catchAsync=require('./../utils/catchAsync')
const productsOrder=require('./../models/productsOrdered')
const { token } = require('morgan')
const sendEmail = require('./../utils/email')
const { STATUS_CODES } = require('http')
const Product = require('../models/Product')
const orders=require('./../models/OrderModel')
const dpartner=require('./../models/deliveryPartner')
const { count } = require('console')
const { ParticipantConversationInstance } = require('twilio/lib/rest/conversations/v1/participantConversation')
const productsOrdered = require('./../models/productsOrdered')
const DeliveryPartner = require('./../models/deliveryPartner')
const client=new OAuth2Client("")
const otpless=require("otpless-node-js-auth-sdk")
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
const retrievehour=(a,i)=>{
    let b=[];
    for(let k=0;k<a[0].length;k++)
        {
           if(a[i][k]===':')
           {
            //console.log(a[0][k])
            const m1=a[i].substring(k+1)
            const h1=a[i].substring(0,k)
            b.push(parseInt(h1),parseInt(m1))
           // console.log(a[0].substring(k+1))//minutes
           // console.log(a[0].substring(0,k))//hours
           }

        }
        return b

}
const checktimingsofvendor=(open,close)=>{
        // const open=retrievehour(a,0)
        // const close=retrievehour(a,1)
        // console.log(retrievehour(a,0))
        // console.log(retrievehour(a,1))
        var go=true
        var openhr=open[0]
        var closehr=close[0]
        var openmin=open[1]
        var closemin=close[1]
        const dateTimeObject=new Date()
        console.log(dateTimeObject.getHours())
        if(dateTimeObject.getHours()<openhr)
        {
            go=false
        }
        else if(dateTimeObject.getHours()>closehr)
        {
            go=false
        }
        else if(dateTimeObject.getHours()===openhr)
        {
            if(dateTimeObject.getMinutes()<openmin)
            {
                go=false

            }
        }
        else if(dateTimeObject.getHours()===closehr)
        {
            if(dateTimeObject.getMinutes()>closemin)
             {
                go=false

             }
        }

       return go
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
    const freshUser=await User.findById(decoded.id)
   console.log(freshUser)
    if(!freshUser)
    {
        return new AppError('The user belonging to this token does no longer exist',401)
    }
    if(freshUser.changedPasswordAfter(decoded.iat))
    {
        return next(new AppError('User recently changed password! Please login again',401))
    }
     req.user=freshUser
    next()
})
exports.sendmail=catchAsync(async(req,res,next)=>{
    const user=await User.find({email:req.body.email})
    const phone=await User.find({phone:req.body.phone})
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
exports.signupuser=catchAsync(async(req,res,next)=>{
    const newUser=await User.create(req.body);
    const token=signToken(User._id)
   res.status(201).json({
       status:'success',
       token:token,
       data:{
           user:newUser
       }
   })
})

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
    const user= await User.findOne({email}).select('+password')
    console.log(user)
   // console.log(email,password)
    if(!user||!(await user.correctPassword(password,user.password)))
    {
        return next(new AppError('Incorrect Email or Password',401))
    //    return  res.status(400).json({
    //     status:'fail',
    //     message:'Incorrect email or password'
   // })

    }
    const token=signToken(user._id)
    res.status(200).json({
        status:'success',
        token
    })
}catch(err)
{
    res.status(400).json({
        status:'fail',
        message:err.message
    })
}

}
exports.addAddress=catchAsync(async(req,res,next)=>{
    
   // f.user_id=req.user.id
    console.log(req.body)
    const addressuser=await userLocation.create(f)
    res.status(201).json({
        status:'success',
        address:addressuser

    })
})
//add another address
exports.getAddress=catchAsync(async(req,res,next)=>{
    const address=await userLocation.find({user_id:req.params.userid})
    res.status(201).json({
        status:'status',
        addresses:address,
        numberofaddress:address.length

    })
})
exports.addlikedproducts=catchAsync(async(req,res,next)=>{
  //  const productsss=await products.find({$or:[{title:{$regex:regx}},{product_id:{$regex:regx}}]})
    // const isalreadyliked=await likedItems.find({$and:[{user_id:req.body.user_id},{product_id:req.body.product_id}]})
    // console.log(isalreadyliked.length)
    // if(isalreadyliked.length>0)
    // {
    //     return next(new AppError('Already liked'))
    // }
    const addlike=await likedItems.create(req.body)
    res.status(201).json({
        status:'success',
        likedproduct:addlike
})})
exports.getlikedproducts=catchAsync(async(req,res,next)=>{
   // const likedproductss=await likedItems.find({vendor_id:req.params.vendor_id}).populate({path:'user_id'}).populate({path:'product_id'})
   //for populating 2 paramters
   const likedproductss=await likedItems.find({vendor_id:req.params.vendor_id}).populate({path:'product_id'})
    res.status(201).json({
        status:'success',
        likedproducts:likedproductss
    })
})
exports.deleteLikedItems=catchAsync(async(req,res,next)=>{
    console.log(req.params.id)
   
    const del=await likedItems.deleteOne({_id:req.params.id})
    if(del.deletedCount===1)
    {
        res.status(201).json({
            status:"success",
            msg:"liked product removed"
        })
    }
    else
    {
       return next(new AppError('Product not deleted',400))
    }
    
})
exports.addtocart=catchAsync(async(req,res,next)=>{
    const carts=await cart.find({user_id:req.params.id}).populate({path:'product_id'})
    const getproductsvendorid=await Product.find({_id:req.body.product_id}).select('vendor_id')
    console.log(getproductsvendorid[0].vendor_id)
    console.log(carts[0].product_id.vendor_id)
    var products_vendorid=getproductsvendorid[0].vendor_id
    var vendor_id=carts[0].product_id.vendor_id
    console.log(products_vendorid === vendor_id)
    if(products_vendorid===vendor_id)
    {
        console.log(3)
        const newcart=await cart.create(req.body)
        res.status(201).json({
        status:'success',
        cart:newcart
    })
   }
    else
    {
        const delcart=await cart.deleteMany({user_id:req.body.user_id})
        console.log(delcart.deletedCount)
        const newcart=await cart.create(req.body)
        res.status(201).json({
        status:'success',
        cart:newcart
    })
        
        
        
    }

    })
exports.secondcart=catchAsync(async(req,res,next)=>{
   
    //const addcart=await cart.create({user_id:req.user.id,product_id:req.body.product_id,price:req.body.price,qty:req.body.qty,size:req.body.size,img})
    f=req.body
    f.user_id=req.user.id
    console.log(f)
    const addcart=await cart.create(f)
    res.status(200).json({
        status:'success',
        cart:addcart

    })
   
})
exports.increaseqty=catchAsync(async(req,res,next)=>{
    const product=await products.findById(req.body.product_id)
    console.log(product)
    var variations=product.variations
    var variationlength=product.variations.length
    console.log(variationlength)
    var c1;
    var torf=false;
    var count=req.body.count
    console.log(variations[0].color_name==req.body.variation_name)
     for(var i=0;i<variationlength;i++)
     {
        
        console.log(variations[i].color_name)
        if(req.body.size)
        {
              if(variations[i].color_name==req.body.variation_name&&variations[i].size==req.body.size)
                {
                    console.log(variations[i]._id)
            if(count<=variations[i].stock)
            {
            c1=count
            torf=true;
          //  console.log(cartdetails.price)
            var cartprice=variations[i].price*count
           
            
            await cart.findByIdAndUpdate(req.params.id,{qty:c1,price:cartprice},{
                runValidators:true,
                new:true
            })
            

            }

                }
        }
        else if(variations[i].material==req.body.variation_name||variations[i].color_name==req.body.variation_name)
        {
            console.log(variations[i]._id)
            if(count<=variations[i].stock)
            {
            c1=count
            torf=true;
          //  console.log(cartdetails.price)
            var cartprice=variations[i].price*count
           
            
            await cart.findByIdAndUpdate(req.params.id,{qty:c1,price:cartprice},{
                runValidators:true,
                new:true
            })
            

            }
        }
     }
     if(torf)
     {
        res.status(200).json({
            status:'success',
            qty:c1
        })
     }
     else
     {
        return next(new AppError('Stock not satisfied',400))
     }

   // console.log(product)
    

    
})
exports.carticonclick=catchAsync(async(req,res,next)=>{
    const carts=await cart.find({user_id:req.user.id}).populate('product_id')
    let b=[]
    let atra=true;
    let ptimings=true
    let stock_shopactive_pactive=true

    
    const radius=17/6378.1
    for(var i=0;i<carts.length;i++)
    {   
        let as=carts[i].product_id.shop_address.shop_timings
        console.log(as)
         const open=retrievehour(as,0)
         const close=retrievehour(as,1)
         console.log(open)
         console.log(close)
         console.log(checktimingsofvendor(open,close))
         if(checktimingsofvendor(open,close)===false)
         {
            ptimings=false
            console.log(`timings illa mathe ${ptimings}`)
         }
         if(carts[i].product_id.status===false)
            {
                product_status=false
            }
        let a=carts[i].product_id.variations
       let coordinates=carts[i].product_id.shop_address.coordinates
       let shop_open=carts[i].product_id.shop_address.manual_open
       console.log(`shop manual open ${shop_open}`)
        const productss=await products.find({
            $and:[{loc:{$geoWithin:{$centerSphere:[[coordinates[0],coordinates[1]],radius]}}},{status:true},{_id:carts[i].product_id}]
            
        })
        console.log(productss.length)
        if(productss.length===0)
        {
            atra=false
            console.log("no products in these area")
        }
        
        for(var k=0;k<a.length;k++)
        {
            if(carts[i].variation_name==a[k].color_name)
            {
                if(carts[i].qty>a[k].stock||carts[i].product_id.status===false)
                {
                    ptimings=false
                    stock_shopactive_pactive=false

                   
                }

            }

        }
        if(ptimings===false||stock_shopactive_pactive===false||atra===false||shop_open===false)
        {
            b.push(carts[i]._id)
        }
       
    }
    res.status(200).json({
        data:carts,
        notactivecarts:b

    })
    


})
exports.getcartitems=catchAsync(async(req,res,next)=>{
    const usercarts=await cart.find()
    return usercarts
})
let sumn=(p)=>{
    return p

}
let getdpartners=(orderid)=>{
    let b=[]
    let a=orders.findById(orderid).exec()
//     a.exec((err,partner)=>{
//       b=partner
//     })
//    return b
   
   
}
// async function findResult(orderid) {
//     return await orders.findById(orderid);
//   }
function extractids(obj)
{
    let a=[]
    for(var i=0;i<obj.length;i++)
    {
        a.push(obj[i]._id)
    }
    return a

}
function findResult(orderid){
    return new Promise((resolve, reject) => {
      orders.findById(orderid).then(result => {
        resolve(result);
      })
     .catch(err => reject(err));
    })
  } 
  function findpartners(){
    return new Promise((resolve, reject) => {
      dpartner.find({active:true,ongoing_delivery:false}).then(result => {
        resolve(result);
      })
     .catch(err => reject(err));
    })
  } 
  function updateOrder(orderid,ndpid)
  {
    return new Promise((resolve, reject) => {
        orders.findByIdAndUpdate(orderid,{d_partner_id:ndpid}).then(result => {
          resolve(result);
        })
       .catch(err => reject(err));
      })
    
  }
  function makeongoingfalse(dpid)
  {
    return new Promise((resolve,reject)=>{
        dpartner.findByIdAndUpdate(dpid,{ongoing_delivery:false}).then(result=>{
            resolve(result)
        })
        .catch(err=>reject(err))
    })
  }
  function adddpartnersids(dpid,order_id)
  {
    return new Promise((resolve,reject)=>{
      
        orders.findByIdAndUpdate(order_id,{$push:{dp_can_or_ntaccpt:dpid}}).then(result=>{
            resolve(result)
        })
        .catch(err=>reject(err))
    })
  }

// 
function makedp(array1,array2)
{
    let b=[]
    for (var i = 0; i<array2.length; i++) {
        var arrlen = array1.length;
        for (var j = 0; j<arrlen; j++) {
            if (array2[i] == array1[j]) {
                array1 = array1.slice(0, j).concat(array1.slice(j+1, arrlen));
            }
        }
    }
    b=array1
    return b



}

function change(orderid){
    var task = cron.schedule('*/1 * * * *', () =>  {
        
        findResult(orderid).then(res => {
            console.log(res.acceptedBydpartner)
            let partner_id=res.d_partner_id
            if(res.acceptedBydpartner===false)
            {
                //const dp=dpartner.find({active:true},{dpartner:{$ne:order.d_partner_id}})
                makeongoingfalse(res.d_partner_id).then(resp=>{})
               
                findpartners(res.d_partner_id).then(resp=>{
                    findResult(orderid).then(order=>{
                        
                        
                         let array1=extractids(resp)
                         let array2=extractids(order.dp_can_or_ntaccpt)
                         
                       console.log(makedp(array1,array2))
                       // console.log(idsofdpartners)
                        
                     //  console.log(idsofdpartners.length)
                      // var k=idsofdpartners.length>0?idsofdpartners:resp
                       // console.log(k)
                       
                      //  let x = Math.floor((Math.random() * k.length) )//(include 0 and exclude 6)
                     //   console.log(`Next assigned dp ${k[x]._id}`)
                       // updateOrder(orderid,k[x]._id).then(respo=>{ // problem random ;ine allide
                           // console.log('ki')
    
                      //  })
    

                    })
               

                })
            }
            else
            {
                task.stop()
            }
            
            
            
         });
        
       
            // let result=findResult(orderid)
            // console.log(result)
       
           //const order=orders.find()
        //    console.log('a')
        //    var a=getdpartners(orderid)
        //    console.log(a)
           
        //    //var b=JSON.stringify(a)
        //   // console.log(b.length)
        //    if(order.acceptedBydpartner===false)
        //    {
        //     const dp=dpartner.find({active:true},{dpartner:{$ne:order.d_partner_id}})
        //     let x = Math.floor((Math.random() * dpartner.length+1) )//(include 0 and exclude 6)
        //     console.log(x)

        //     const orderupdate=orders.findByIdAndUpdate(orderid,{d_partner_id:dp[x]},{
        //         runValidators:true,
        //         new:true

        //     })
        //    }
        //    else
        //    {
        //     task.stop()
        //    }
           }, {
             scheduled: true
           });
           


}
exports.addOrder=catchAsync(async(req,res,next)=>{
   
   // console.log(c)
   // const jsonn=JSON.stringify(c)
   // console.log(jsonn)
    f=req.body
    f.user_id=req.user.id
    const dpartners=await dpartner.find({active:true},{ongoing_delivery:false})
   // console.log(dpartners.length)
    let x = Math.floor((Math.random() * dpartner.length) )//(include 0 and exclude 6)
   // console.log(x)
    req.d_partner_id=dpartners[x]
    //console.log(Date.now()+4*60*1000-Date.now())
    const neworder=await orders.create(f)
    await dpartner.findByIdAndUpdate(neworder.d_partner_id,{ongoing_delivery:true})//make it false after order completion
    change(neworder._id)
    console.log(`1st assigned dp ${neworder.d_partner_id}`)
    res.status(200).json({
        newOrder:neworder,
        msg:'Order has been placed'
    })
    



    
    // setTimeout(()=>{
    //     console.log("hello")
    // },10000)
    // const number=neworder.products_ordered
    // console.log(number)

})
exports.storeaddress=catchAsync(async(req,res,next)=>{
    console.log(req.user) 
    console.log(req.body)
    f=req.body
    f.user_id=req.user.id

    const address=await userLocation.create(f)
    res.status(200).json({
        status:'success',
        newaddress:address
    })
})
exports.productsorder=catchAsync(async(req,res,next)=>{
    const orderproducts=await productsOrder.insertMany(req.body)
    res.status(200).json({
        status:'success',
        products:orderproducts

    })

})
exports.deleteaddressesgekko=catchAsync(async(req,res,next)=>{
    const deleteaddresses=await VendorLocation.deleteMany({vendor_id:'65ec3f232849e849143d2222'})
    res.status(200).json({
        status:'success',
        delete:deleteaddresses.length

    })
})

exports.forgotPassword=catchAsync(async (req,res,next)=>{
    const user=await User.findOne({email:req.body.email})
    if(!user)
    {
        return next(new AppError('There is no user with email address',404))
    }
    const resetToken=user.createPasswordResetToken()
    await user.save({validateBeforeSave:false})
    const reseturl=`${req.protocol}://${req.get('host')}/api/v1/user/resetpassword/${resetToken}`
    const message=`Forgot your password ? Submit a Patch request with your new password and confirm password to :
    ${reseturl}.\n If you dint forget your password please ignore it`
    try{
    await sendEmail({
        email:user.email,
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
       user.passwordResetToken=undefined
       user.passResetExpires=undefined
       await user.save({validateBeforeSave:false})
       return next(new AppError(err.message,500))

    }
})
exports.ResetPassword=catchAsync(async (req,res,next)=>{
const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex')
const user=await User.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gt:Date.now()}})
if(!user)
{
    return next(new AppError('Token is invalid or has  expired',400))
}
user.password=req.body.password
user.passwordConfirm=req.body.passwordConfirm
user.passwordResetToken=undefined
user.passwordResetExpires=undefined
await user.save()
const token=signToken(user._id)
res.status(200).json({
    status:'success',
    token
})
})
const createSendToken=(user,statuscode,res)=>{
    const token=signToken(user._id)
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
            user
        }
    })
}
exports.updatePassword=catchAsync(async (req,res,next)=>{
    const user=await User.findById(req.vendor.id).select('+password')
    if(!(await user.correctPassword(req.body.passwordCurrent,user.password))){
    return next(new AppError('Your current password is wrong',401))
    }
    user.password=req.body.password
    user.passwordConfirm=req.body.confirmpassword
    await user.save()
    //vendor.findByIDAndUpdate() function will not work as intended so we used this
    createSendToken(user,200,res)

})
exports.verifyphone=catchAsync(async(req,res,next)=>{
    var a=Math.floor(Math. random() * (9999 - 1000 + 1)) + 1000
   // await sendsms(`otp is ${a}`)
    await User.findByIdAndUpdate(req.user.id,{otp:a},{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        status:'success',
        msg:'Otp sent successfulyy'
    })


})
exports.contacttosupport=catchAsync(async(req,res,next)=>{
    const addsupport=await support.create({vendor_id:req.user.id,msg:req.body.msg})
    res.status(200).json({
        status:200,
        newsupp:addsupport,
        msg:'Ticket raised'

    })

})
exports.productsdetailspage=catchAsync(async(req,res,next)=>{
    const productdetails=await products.findById(req.params.id)
    const variations=productdetails.variations
    var b=[]
    var c=[]
    for(var i=0;i<variations.length;i++)
    {
        if(variations[0].name===variations[i].name)
        {
            b.push(variations[i])

        }
    }
    for(var j=0;j<b.length;j++)
    {
        if(b[j].stock>0)
        {
            c.push(b[j])
        }
    }

    res.status(200).json({
        p:c
    })

})
exports.selectvariation=catchAsync(async(req,res,next)=>{
    const productsgiven=req.body.products
    const variations=productsgiven.variations
    var b=[]
    var c=[]
    for(var i=0;i<variations.length;i++)
    {
        if(req.body.pressedname===variations[i].name)
        {
            b.push(variations[i])

        }
    }
    for(var j=0;j<b.length;j++)
    {
        if(b[j].stock>0)
        {
            c.push(b[j])
        }
    }

    res.status(200).json({
        p:c
    })

})
exports.selectsize=catchAsync(async(req,res,next)=>{
    var b=[]
    var selectsize=req.params.size
    var variation_name=req.params.name
    console.log(req.params.id)
    console.log(req.params.name)
    const product=await products.findById(req.params.id)
    console.log(product)
    const variations=product.variations
    for(var i=0;i<variations.length;i++)
    {
        if(variation_name===variations[i].color_name)
        {
            if(variations[i].size===selectsize)
            {
                b.push(variations[i])

            }
        }
    }
    res.status(200).json({
        status:'success',
        resp:b
    })
    
})
exports.buynowbtninproductdetails=catchAsync(async(req,res,next)=>{

    const productorderedd=await productsOrdered.create(req.body)

    

})
//show products home page
exports.signuporloginwithgoogle=catchAsync(async(req,res,next)=>{
    // const {tokenId}=req.body
    // client.verifyIdToken({tokenId,audience:""}).then(response=>{
    //     const {email_verified,name,email} =response.getPayload
    //     console.log(response.getPayload)
    // })
    const ifuser=await User.find({email:req.body.email})
    console.log(ifuser)
    var userr
    if(ifuser.length<1)
    {
        userr=await User.create(req.body)
    }
    else
    {
        userr=ifuser
    }
    const token=signToken(userr._id)
    res.status(200).json({
        status:200,
        userrr:userr,
        msg:"Signed in",
        token:token


    })

})
exports.timingsbool=catchAsync(async(req,res,next)=>{
    console.log(checktimingsofvendor([10,30],[22,30]))
})
exports.otpless=catchAsync(async(req,res,next)=>{
    const response = await otpless.sendOTP("+917338427124", "","SMS", "", "", 600, 4, "SI0GC82648BNNOQAN172U2BSGGKTC7S5","7fy3d9x1efz244okjttmsy7ckb0akixu");
    console.log(response)
})
exports.verifyotpless=catchAsync(async(req,res,next)=>{
    const response = await otpless.verifyOTP("", "+917338427124", "Otp_04FE2238AE304FBFAE7989141CC9D28C", 5098,"SI0GC82648BNNOQAN172U2BSGGKTC7S5","7fy3d9x1efz244okjttmsy7ckb0akixu")
    console.log("response:", response);


})
exports.getallproducts=catchAsync(async(req,res,next)=>{
    const allprod=await products.find().populate({path:'variations'}).populate('vendor_id').populate('shop_address')
    res.status(200).json({
        status:'success',
        prod:allprod
    })
   
})
