const { text } = require('express');
const mongoose=require('mongoose')
const colorSizeClothesSchema=new mongoose.Schema({
    color_name:{
        type:String,
        required:[true," must have name"],
        unique:true
    },
    size: {
        type : mongoose.Schema.ObjectId,
        ref : 'ClothesSize'
        },
    stock:{
        type:Number,
        required:[true," must have a stock"]

    },
    price:{
        type:String,
        required:[true,"Must have a price"]
    },
    img:{
        type:String,
        required:[true,"Must have image"]

    },
   
})


const colorSize=mongoose.model('ColorSizeClothes',colorSizeClothesSchema)
module.exports=colorSize