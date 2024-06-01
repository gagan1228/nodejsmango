const { text } = require('express');
const mongoose=require('mongoose')
const colorNameschema=new mongoose.Schema({
    product_id:{
        type:mongoose.Schema.ObjectId,
        ref:'Product'
    },
    color_name:{
        type:String,
       // required:[true," must have name"],
        
    },
    stock:{
        type:Number,
        required:[true," must have a stock"]

    },
    price:{
        type:Number,
        required:[true,"Must have a price"]
    },
    img:[{
        type:String,
        required:[true,"Must have image"]

    }],
    size:{
        type:String,
       // required:[true,"Size is must"]
    },
    material:{
        type:String,
       // required:[true,"must have a material"]
    }
    // variation:
    //     {
    //     type : String,
        
    //     }
    
})
// colorNameschema.methods.makeundefine=function(n)
// {
//    if(n===1)
//    {
//     colorNameschema.size=undefined
//     colorNameschema.material=undefined
//    }
//    else if(n===2||n===3)
//    {
//     colorNameschema.material=undefined
//    }
//    else
//    {
//     colorNameschema.color_name=undefined
//    }
//    return n
// }


const colorName=mongoose.model('ColorName',colorNameschema)
module.exports=colorName