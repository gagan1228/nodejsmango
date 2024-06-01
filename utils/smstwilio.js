const accountSid=process.env.TWILIO_ACCOUNT_SID
const authtoken=process.env.TWILIO_AUTH_TOKEN
const dotenv=require('dotenv')
dotenv.config({path:'./config.env'});
const client=require('twilio')(accountSid,authtoken)
const sendsms=async (body)=>{
    let msgOptions={
        from:process.env.TWILIO_FROM_NUMBER,
        to: '+917338427124',
        body
    }
    try{
        const message=await client.messages.create(msgOptions)
        console.log(message)
    }catch(err)
    {
        console.log(err)
    }
}
module.exports=sendsms