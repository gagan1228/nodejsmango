const { text } = require('express');
const mongoose=require('mongoose')
const ReviewsSchema=new mongoose.Schema({
  user_id:{
    type:mongoose.Schema.ObjectId,
    ref:'User'
  },
  product_id:{
    type:mongoose.Schema.ObjectId,
    ref:'Product'

  },
  rating:{
    type:Number
  },
  reviewMessage:{
    type:String
  }


})


const Reviews=mongoose.model('Reviews',ReviewsSchema)
module.exports=Reviews