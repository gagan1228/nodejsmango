const multer=require('multer')
const firebase=require('firebase/app')
const catchAsync=require('./../utils/catchAsync')
const {getStorage,ref, uploadBytes}=require('firebase/storage')
const firebaseConfig = {
    apiKey: "AIzaSyAgEs-81WAlq4G-ZKyR9FPk5QG7A_SiYUc",
    authDomain: "storingimages-2afe9.firebaseapp.com",
    projectId: "storingimages-2afe9",
    storageBucket: "storingimages-2afe9.appspot.com",
    messagingSenderId: "808067372699",
    appId: "1:808067372699:web:9e3baae691703e2b71583e",
    measurementId: "G-YDHRC9BXCL"
  };
firebase.initializeApp(firebaseConfig)
const storage=getStorage()
const upload=multer({storage:multer.memoryStorage()})
exports.uploadphoto=catchAsync(async(req,res,next)=>{
    const storageRef=ref(storage,`files/${req.filename.originalname}`)
    uploadBytes(storageRef,req.filename.buffer).then((snapshot)=>{
        console.log('file uploaded')
    })
    console.log(req.file)
})