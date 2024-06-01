const Tour=require('./../models/tourModel')
const ApiFeatures=require('./../utils/apifeatures')
const Category=require('./../models/categoryModel')
exports.checkBody=(req,res,next)=>{
    if(!req.body.name||!req.body.price)
    {
        return res.status(400).json({
            status:'fail',
            message:'missing name or price'
        });
    }
    next();
};

exports.aliasTopTours=(req,res,next)=>{
    //req.query.page='2';
    req.query.limit='2';
    req.query.sort='-price';
    //req.query.fileds='name,price';
    next();
}
exports.getAllTours=async (req,res)=>{
    try
    {
        //Filtering
    //     const queryobj={...req.query}
    //     const excludeFields=['page','sort' ,'limit','fields']
    //     excludeFields.forEach(el=>delete queryobj[el])
    //     console.log(queryobj)
    //     //methods of filtering
    //   //  const toursfilter=await Tour.find({duration:5,difficulty:'easy'})
    //  //const toursfilter=await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
    // // const tours=await Tour.find(req.query)
    // //Advance filtering
    // let queryStr=JSON.stringify(queryobj)
    // queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=> `$${match}`)
    // console.log(JSON.parse(queryStr))
    // let query=Tour.find(JSON.parse(queryStr))
    //       filtering using sort
    // if(req.query.sort){
    //     const sortby=req.query.sort.split(',').join(' '); //for sorting both fields price and rating
    //     query=query.sort(sortby)
    //    // query=query.sort(req.query.sort)

    // }
    // else{
    //     query=query.sort('-createdAt')
    // }
    //filtering using fields
    // if(req.query.fields)
    // {
    //     const fields=req.query.fields.split(',').join(' ')
    //     query=query.select(fields)
    // }
    // else{
    //     query=query.select('-__v')
    // }
    //pagination
    // const page=req.query.page*1||1
    // const limit=req.query.limit*1||100
    // const skip=(page-1)*limit
    // query=query.skip(skip).limit(limit)
    // if(req.query.page)
    // {
    //     const numtours=await Tour.countDocuments()
    //     if(skip>=numtours)
    //     {
    //         throw new Error("This page does not exist")
    //     }
    // }
    //const query=Tour.find(queryobj)
    const features=new ApiFeatures(Tour.find(),req.query).filter().sort().limitfields().paginate()
    const tours=await features.query;
    res.status(200).json({
        status:'success',
        data:{
            results:tours.length,
            data:{
                tours
            }

        }
    })
    }catch(err){
    res.status(400).json({
        status:"fail",
        message:err
    })
    
}
}
exports.getTour =async (req,res)=>{
    try
    {
     const tour=await Tour.findById(req.params.id);
    res.status(200).json({
        status:'success',
        data:{
          tour
        }
    })
    }catch(err){
    res.status(400).json({
        status:"fail",
        message:err
    })
    
}

}

exports.createTour = async (req,res) =>{
    try
    {
     const newTour=await Tour.create(req.body);
    res.status(201).json({
        status:'success',
        data:{
            tour:newTour

        }
    })
    }catch(err){
    res.status(400).json({
        status:"fail",
        message:err
    })
    
}
}
exports.updateTour =async (req,res)=>{
    try
    {
     const tour=await Tour.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
     });
    res.status(200).json({
        status:'success',
        data:{
          tour
        }
    })
    }catch(err){
    res.status(400).json({
        status:"fail",
        message:err
    })
    
}

}

// exports.getTourStats=async (req,res)=>{
//     try{
//         const stats=await Tour.aggregate([
//             {
//                 $match:{rating:{$gte:4.5}}
//             },
//             {
//                 $group:{
//                     _id:{$toUpper:'$difficulty'},//difficult to go on a tour according to mongodb stats using price of tours,rating etc
//                    numTours:{$sum:1},//increments by 1 for total number of documents
//                     numRatings:{$sum:'rating'},
//                     avgRatings:{$avg:'rating'},
//                     avgprice:{$avg:'price'},
//                     minprice:{$min:'price'},
//                     maxprice:{$max:'price'}

//                 }
//             },
//             {
//                 $sort:{avgPrice:1}// sort price ascending order
//             },
//             // {
//             //     $match:{
//             //         _id:{$ne:'EASY'}
//             //     }
//             // }
//         ])
//         res.status(200).json({
//             status:'success',
//             data:{
//                 stats
//             }
//         })

//     }catch(err){
//         res.status(404).json({
//             status:'fail',
//             message:err
//         })
//     }
// }