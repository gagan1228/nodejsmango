const { text } = require('express');
const mongoose=require('mongoose')
const productSumneSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"A category must have name"],
        unique:true
    },
    description:{
        type:String,
        

    },
    embedding:[Number]
})


const ProductSumne=mongoose.model('ProductSumne',productSumneSchema)
module.exports=ProductSumne