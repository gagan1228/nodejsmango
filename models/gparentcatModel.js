const { text } = require('express');
const mongoose=require('mongoose')
const category=require('./../models/categoryModel')
const gparentSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"A category must have name"],
        unique:true
    },
    gpcatimg:{
        type:String,
        required:[true,"A category must have a image"]
    },
    categories:[
        {
        type : mongoose.Schema.ObjectId,
        ref : 'Category'
        }
    ]
})


const gparentCategory=mongoose.model('gparentCategory',gparentSchema)
module.exports=gparentCategory