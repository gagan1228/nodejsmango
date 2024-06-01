const { text } = require('express');
const mongoose=require('mongoose')
const OrderSchema=new mongoose.Schema({
    order_id:{
        type:Number,
        required:[true,"A OrderSchema  must have order_id"],
    },
    user_id:  {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        autopopulate:true
        },
        d_partner_id:{
            type:mongoose.Schema.ObjectId,
            ref:'DeliveryPartner',
            autopopulate:true
        },
        acceptedBydpartner:{
            type:Boolean,
            default:false
        },
        items_given_to_dp:{
            type:Boolean,
            default:false

        },order_cancelled:
        {
          type:Boolean,
          default:false
        },
        products_ordered:[{
            type:mongoose.Schema.ObjectId,
            ref:'ProductsOrdered',
            autopopulate:true
        }],
        user_location:{
            type:mongoose.Schema.ObjectId,
            ref:'UserLocation',
            autopopulate:true
        },
        order_not_responding:{ //return to vendor the products
            type:Boolean,
            default:false
        },
        TotalAmount:{
            type:Number

        },
        dpartnerchanceexpires:{
            type:Date
        },
        dp_can_or_ntaccpt:[{//storing ids of cancelled or not attended orders by dp .
            type:mongoose.Schema.ObjectId,
            ref:'DeliveryPartner',
            autopopulate:true

        }],
        time:{
            type:Date,
            default:Date.now()
        },
        order_completed:{
            type:Boolean,
            default:false
        },
        payment_type:{
            type:String

        }

   
})
OrderSchema.methods.check4minutes=function(){
    this.dpartnerchanceexpires=Date.now()+4*60*1000
}

OrderSchema.plugin(require('mongoose-autopopulate'))
const OrderSchemaa=mongoose.model('Order',OrderSchema)
module.exports=OrderSchemaa