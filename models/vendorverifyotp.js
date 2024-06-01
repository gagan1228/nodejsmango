const mongoose=require('mongoose')
const VendorOtpVerificationSchema=new mongoose.Schema({
  userId:{
    type:String,
    required:[true,'Must have a userid']
  },
  otp:{
    type:String,
    required:[true,'Must have a otp']
  },
  createdAt:Date,
  expiresAt:Date


}
);

const VendorOtpVerification=mongoose.model('UserOtpVerification',VendorOtpVerificationSchema)
module.exports=VendorOtpVerification