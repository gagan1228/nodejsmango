const { text } = require('express');
const mongoose=require('mongoose')
const userAddressSchema=new mongoose.Schema({
   user_id:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    address:{
        type:String
    },
   
    coordinates:[Number],
    flatorhouseorbuildingname:{
        type:String
    },
    landmark:{
        type:String
    },
    receiversname:{
        type:String
    },
    phonenumber:{
        type:Number
    }
    


  
})


const userLocation=mongoose.model('UserLocation',userAddressSchema)
module.exports=userLocation