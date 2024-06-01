const { text } = require('express');
const mongoose=require('mongoose')
const colorSizeShoesSchema=new mongoose.Schema({
    color_name:{
        type:String,
        required:[true," must have name"],
        unique:true
    },
    size: {
        type : mongoose.Schema.ObjectId,
        ref : 'FootwearSize'
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
    variation:
        {
        type : mongoose.Schema.ObjectId,
        ref : 'Variations'
        }
    
})


const colorSizeShoes=mongoose.model('ColorSizeShoes',colorSizeShoesSchema)
module.exports=colorSizeShoes