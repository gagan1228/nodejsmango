const { text } = require('express');
const mongoose=require('mongoose')
const materialSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true," must have name"],
        unique:true
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


const material=mongoose.model('Material',materialSchema)
module.exports=material