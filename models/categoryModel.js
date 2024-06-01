const { text } = require('express');
const mongoose=require('mongoose')
const categoriesSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"A category must have name"],
        unique:true
    },
    gparentcat:{
        type:String,
        required:[true,"A category ust have a grandparent "]

    },
    catimg:{
        type:String,
        required:[true,"A category must have a image"]
    },
    subcategories:[
        {
        type : mongoose.Schema.ObjectId,
        ref : 'SubCategory'
        }
    ]
})


const Category=mongoose.model('Category',categoriesSchema)
module.exports=Category