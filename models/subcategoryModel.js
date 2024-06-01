const { text } = require('express');
const mongoose=require('mongoose')
const subcategoriesSchemafinal=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"A sub category must have name"],
        
    },
    category:{
        type:String,
        required:[true,"A subcategory must have a category"]

    },
    scatimg:{
        type:String,
        required:[true,"A category must have a image"]
    }
})


const SubCategory=mongoose.model('SubCategory',subcategoriesSchemafinal)
module.exports=SubCategory