const catchAsync=require('./../utils/catchAsync')
const axios = require('axios');
const sha256=require('sha256')
const phonepe_host_url='https://api-preprod.phonepe.com/apis/pg-sandbox'
const Merchant_Id='PGTESTPAYUAT'
const uniqid=require('uniqid')
const Salt_index=1
const Salt_key='099eb0cd-02cf-4e2a-8aca-3e6c6aff0399'
exports.phonepe=catchAsync(async(req,res,next)=>{
    res.status(200).json({
        status:'success',
        message:'Phone pe is working'
    })
})
exports.getpay=catchAsync(async(req,res,next)=>{
const payEndpoint='/pg/v1/pay'
const merchantTransactionId=uniqid()
const userid=123
const payload={
    "merchantId": Merchant_Id,
    "merchantTransactionId": merchantTransactionId,
    "merchantUserId": userid,
    "amount": 10000,
    "redirectUrl": `https://localhost:3000/redirect-url/${merchantTransactionId}`,
    "redirectMode": "REDIRECT",
    "callbackUrl": "https://webhook.site/callback-url",
    "mobileNumber": "9999999999",
    "paymentInstrument": {
      "type": "PAY_PAGE"
    }
  }
  const bufferObj=Buffer.from(JSON.stringify(payload),"utf8")
  const base63EncodedPayload=bufferObj.toString("base64")
  const xVerify=sha256(base63EncodedPayload+payEndpoint+Salt_key)+"###"+Salt_index
const options = {
  method: 'post',
  url: `${phonepe_host_url}${payEndpoint}`,
  headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY':xVerify
				},
data: {
    request:base63EncodedPayload
}
};
axios
  .request(options)
      .then(function (response) {
      console.log(response.data);
      const url=response.data.data.instrumentResponse.redirectInfo.url
      res.redirect(url)
      //res.send({url})
  })
  .catch(function (error) {
    console.error(error);
  });
})