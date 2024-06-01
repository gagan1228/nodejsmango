const mongoose=require('mongoose')
const dotenv=require('dotenv')
const app=require('./app')
const cors=require('cors')
app.use(cors(
    {origin: "http://localhost:5173",
    methods : ["GET", "POST", "PUT", "DELETE"]
})
)
process.on('uncaughtException',err=>{
    console.log('Uncaught Exception Shutting Down')
    console.log(err.name,err.message)
    process.exit(1)
})
dotenv.config({path:'./config.env'});
const DB=process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(con=>{
    console.log(con.connections)
    console.log('DB connection successful');

});

// const testTour=new Tour(
//     {
//         name:"The forest",
//         rating:3.5,
//         price:890
//     }
// );
// testTour.save().then(doc=>{
//     console.log(doc)
// }).catch(err=>{
//     console.log("Error:",err)
// });

const port=process.env.PORT || 3000
const server=app.listen(port,()=>{
    console.log(`App runningg on port ${port}`)
})
process.on('unhandledRejection',err=>{
    console.log(err.name,err.message)
    console.log('Unhandled Rejection Shutting Down')
    server.close(()=>{
        process.exit(1)
    })
})