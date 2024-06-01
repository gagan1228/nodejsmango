const { text } = require('express');
const mongoose=require('mongoose')
const likedSchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    product_id:{
        type:mongoose.Schema.ObjectId,
        ref:'Product'
    },
   
    
})


const Liked=mongoose.model('Liked',likedSchema)
module.exports=Liked