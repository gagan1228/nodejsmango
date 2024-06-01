const { text } = require('express');
const mongoose=require('mongoose')
const ProductsOrderedSchema=new mongoose.Schema({
  user_id:{
    type:mongoose.Schema.ObjectId,
    ref:'User'
  },
  product_id:{
    type:mongoose.Schema.ObjectId,
    ref:'Product'
},
qty:{
    type:Number
},
 img:{
   type:String
 },
 title:{
    type:String
  },
  variation_name:{
    type:String

  },
  size:{
    type:String

  },
  price:{
    type:Number
  }

 

})


const productsOrdered=mongoose.model('ProductsOrdered',ProductsOrderedSchema)
module.exports=productsOrdered