const mongoose=require('mongoose')
const validator=require('validator')
const tourSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"A tour must have a name"],
        unique:true,
        validate:[validator.isAlpha,'Tour name must only contain characters']
        },

    rating:{
        type:Number,
        default:4.5
    },
    price:{
        type:Number,
        required:[true,"A tour must have a name"]
    }
}
);
const tourSchema1=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"A tour must have a name"],
        unique:true
        },

    rating:{
        type:Number,
        default:4.5
    },
    price:{
        type:Number,
        required:[true,"A tour must have a name"]
    }
}
);
const Tour=mongoose.model('Tour',tourSchema);
const Tour1=mongoose.model('Tour1',tourSchema1)
module.exports=Tour1