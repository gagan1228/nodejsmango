const { text } = require('express');
const mongoose=require('mongoose')
const shop_detailsSchema=new mongoose.Schema({
    vendor_id:{
        type:mongoose.Schema.ObjectId,
        ref:'Vendor'
    },
    shop_name:{
        type:String

    },
    shop_timings:{
        type:[String]
    },
    address:{
        type:String
    },
    shop_details:{
        type:String

    },
    coordinates:{
        type:[Number],
      //  select:false
    },
    manual_open:{
        type:Boolean
    }
    
  


   

  
})


const ShopDetails=mongoose.model('ShopDetails',shop_detailsSchema)
module.exports=ShopDetails