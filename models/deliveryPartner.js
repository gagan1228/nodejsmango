const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const crypto=require('crypto')

const DeliveryPartnerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"A Vendor must have a name"],
        },

    username:{
        type:String,
        required:[true,"A Vendor must have a username"],
        unique:true
    },
    email:{
        type:String,
        required:[true,"A Vendor must provide an email"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide an valid email']

    },
    photo: {
        type:String
    }
    ,
    password:{
        type:String,
        required:[true,'Please confirm your password'],
        minlength:8,
        select:false
    },
    passwordConfirm:{

        type:String,
        required:[true,'Please confirm your password'],
        validate:{
            //This only works on create and save 
            validator:function(el)
            {
                return el===this.password //abc===abc
            },
            message:'Passwords are not the same'
        }

    },
    phone:{
        type:Number,
        required:[true,"A Vendor must have a number"]
    },
    phoneVerified:{
        type:Boolean,
        default:false
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
        type:Boolean,
        default:false,
       
    },
    otp:{
        type:Number
    },
    otpExpires:Date,
    timestamp:Date,
    wallet:{
        type:Number
    },
    ongoing_delivery:{
        type:Boolean,
        default:false
    }

}
);
DeliveryPartnerSchema.pre('save', async function(next){
   if(!this.isModified('password'))
   return next()
//hash the password to the cost of 12
this.password=await bcrypt.hash(this.password,12)
//delete the confirm password field
this.passwordConfirm=undefined
next()
    
})
DeliveryPartnerSchema.pre('save',function(next){
    if(!this.isModified('password')||this.isNew)  return next()

    this.passwordChangedAt=Date.now()-1000
    next()
    
})

DeliveryPartnerSchema.methods.correctPassword= async function(candidatePassword,userPassword)
{
    return await  bcrypt.compare(candidatePassword,userPassword)
}
DeliveryPartnerSchema.methods.changedPasswordAfter=function(JWTTimestamp)
{
    if(this.passwordChangedAt)
    {   
        const changedTimeStamp=parseInt(this.passwordChangedAt.getTime()/1000,10)
        console(this.passwordChangedAt,JWTTimestamp)
        return JWTTimestamp<changedTimeStamp
    }
    return false
}
DeliveryPartnerSchema.methods.createPasswordResetToken=function()
{
    const resetToken=crypto.randomBytes(32).toString('hex')
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex')
    console.log({resetToken},this.passwordResetToken)
    this.passwordResetExpires=Date.now()+10*60*1000
    return resetToken
}
DeliveryPartnerSchema.plugin(require('mongoose-autopopulate'))

const DeliveryPartner=mongoose.model('DeliveryPartner',DeliveryPartnerSchema)
module.exports=DeliveryPartner