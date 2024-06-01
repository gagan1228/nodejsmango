const http=require('http');
const cors=require('cors')
app.use(cors(
    {origin: "http://localhost:5173",
    methods : ["GET", "POST", "PUT", "DELETE"]
})
)
const server=http.createServer((req,res)=>{
    res.end("Hi from the server");
});
server.listen(8000,'127.0.0.1',()=>{
    console.log("Listening  to the server 8000");
})