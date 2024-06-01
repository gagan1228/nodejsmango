const { text } = require('express');
const mongoose=require('mongoose')
const cartSchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.ObjectId,
        red:'User'
},
    product_id:{
        type:mongoose.Schema.ObjectId,
        ref:'Product'
    },
    price:{
        type:Number,
        required:[true,"A cart must have price"]
     },
    qty:{
        type:Number,
        required:[true,"A cart must have a qty"]
    },
    size:{
        type:String
    },
    img:{
        type:String
    },
    variation_name:{
        type:String
    },
    active:{
        type:Boolean,
        default:true
    }
    
    
})


const Cart=mongoose.model('Cart',cartSchema)
module.exports=Cart