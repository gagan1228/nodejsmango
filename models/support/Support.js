const { text } = require('express');
const mongoose=require('mongoose')
const supportSchema=new mongoose.Schema({
   user_id:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
   vendor_id:{
    type:mongoose.Schema.ObjectId,
    ref:'Vendor'
   },
   d_partner:{
    type:mongoose.Schema.ObjectId,
    ref:'DeliveryPartner'
   },
   message:{
    type:String
   },

   ticketattended:{
    type:Boolean,
    default:false
   }

    


  
})


const support=mongoose.model('Support',supportSchema)
module.exports=support