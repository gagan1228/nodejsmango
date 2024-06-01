
class ApiFeatures{
    constructor(query,queryString)
    {
        this.query=query
        this.queryString=queryString
    }
    filter()
    {
        const queryobj={...this.queryString}
        const excludeFields=['page','sort' ,'limit','fields']
        excludeFields.forEach(el=>delete queryobj[el])
        console.log(queryobj)
        //methods of filtering
      //  const toursfilter=await Tour.find({duration:5,difficulty:'easy'})
     //const toursfilter=await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
    // const tours=await Tour.find(req.query)
    //Advance filtering
    let queryStr=JSON.stringify(queryobj)
    queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=> `$${match}`)
    //console.log(JSON.parse(queryStr))
    this.query.find(JSON.parse(queryStr))

    //let query=Tour.find(JSON.parse(queryStr))
    return this;

    }
    sort()
    {
        if(this.queryString.sort){
            const sortby=this.queryString.sort.split(',').join(' '); //for sorting both fields price and rating
            this.query=this.query.sort(sortby)
           // query=query.sort(req.query.sort)
    
        }
        else{
            this.query=this.query.sort('-createdAt') //dESCENDING ORDER THAT IS LATEST . FROM LAST
        }
        return this;

    }
    limitfields()
    {
        if(this.queryString.fields)
        {
            const fields=this.queryString.fields.split(',').join(' ')
            this.query=this.query.select(fields)
        }
        else{
            this.query=this.query.select('-__v')
        }
        return this;
    }
    paginate()
    {
        const page=this.queryString.page*1||1
        const limit=this.queryString.limit*1||100
        const skip=(page-1)*limit
        this.query=this.query.skip(skip).limit(limit)
        // if(this.queryString.page)
        // {
        //     const numtours=await Tour.countDocuments()
        //     if(skip>=numtours)
        //     {
        //         throw new Error("This page does not exist")
        //     }
        // }
        return this;
    }
   
}
module.exports=ApiFeatures