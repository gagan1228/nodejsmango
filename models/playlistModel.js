const { text } = require('express');
const mongoose=require('mongoose')
const playlistSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"A Playlist must have name"],
        unique:true
    },
    vendor_id:  {
        type : mongoose.Schema.ObjectId,
        ref : 'Vendor'
        }
   
})


const Playlist=mongoose.model('Playlist',playlistSchema)
module.exports=Playlist