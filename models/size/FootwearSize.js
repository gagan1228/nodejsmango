const { text } = require('express');
const mongoose=require('mongoose')
const FootwearSizeSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"A must have name"],
        unique:true
    },
  
})


const FootwearSize=mongoose.model('FootwearSize',FootwearSizeSchema)
module.exports=FootwearSize