class customresponse extends Error{
    constructor(message,statusCode)
    {
        super(message)
        this.statusCode=statusCode
        this.status=`${statusCode}`.startsWith('2')?'success':'good'
        this.isOperational=true
        //Error.captureStackTrace(this,this.constructor)
    }
}
module.exports=customresponse