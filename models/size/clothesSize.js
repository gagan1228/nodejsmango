const { text } = require('express');
const mongoose=require('mongoose')
const clothesSizeSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"A must have name"],
        unique:true
    },
  
})


const clothesSize=mongoose.model('ClothesSize',clothesSizeSchema)
module.exports=clothesSize