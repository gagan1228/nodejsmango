const mongoose=require('mongoose')
const { text } = require('express');
const moment = require('moment-timezone');
const dateIndia = moment.tz(Date.now(), "Asia/Kolkata");
const productSchema=new mongoose.Schema(
  {
    title:{
        type:String,
        required:[true,"A product must have name"],
    },
    gparentcat:{
       type:String,

    },
    category:{
        type:String
    },
    shop_address:{
        type:mongoose.Schema.ObjectId,
        ref:'ShopDetails'

    },
   
    subcategory:
        {
        type:String
        },
    trending:
    {
    type : Boolean
    },
    vendor_id:
    {
        type : mongoose.Schema.ObjectId,
        ref : 'Vendor',
        autopopulate:true
    },
    shop_address:{
        type:mongoose.Schema.ObjectId,
        ref:'ShopDetails',
      

    },
    playlist_id:{
        type : mongoose.Schema.ObjectId,
        ref : 'Playlist'
    },
    Descryption:{
        type:String
    },
    highlights:{
        type:String
    },
    status:{
        type:Boolean,
        default:true

    },
    Seller:{
        type:String

    },
    rating:{
        type:Number,
        default:4

    },
    Keywords:{
        type:String
    },
    Reviews:[{
        type:mongoose.Schema.ObjectId,
        ref:'Reviews',
       
    }],
    variations:[{
        type:mongoose.Schema.ObjectId,
        ref:'ColorName',
       

    }],
    variation_name:{
        type:String,

    },
    product_added_on:{
        type:String,
        default:dateIndia.toDate()

    },
    loc:[Number]
}
)


const Product=mongoose.model('Product',productSchema)

module.exports=Product