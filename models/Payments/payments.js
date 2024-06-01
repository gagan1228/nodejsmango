const { text } = require('express');
const mongoose=require('mongoose')
const paymentsSchema=new mongoose.Schema({
   vendor_id:{
    type:mongoose.Schema.ObjectId,
    ref:'Vendor'
   },
   d_partner:{
    type:mongoose.Schema.ObjectId,
    ref:'DeliveryPartner'
   },
   amount:{
    type:Number
   },
   ispayed:{
    type:Boolean,
    default:false

   }


    
})


const payments=mongoose.model('Payments',paymentsSchema)
module.exports=payments