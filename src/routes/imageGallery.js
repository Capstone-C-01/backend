import { Router } from "express";
import ImageGallery from "../models/imageGallery";

const fs = require("fs");

const router = Router();

const multer = require("multer");

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,'uploads')
    },
    filename: (req,file,cb)=>{
      cb(null,file.originalname)
    }
  })

const upload = multer({ storage: storage });


// const multer  = require('multer')
  
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });

router.post("/updateImage", upload.single("testImage"), (req, res) => {
    var date = new Date();
    var currentTimeStamp = date.getTime();
    
    const saveImage = new ImageGallery({
      user_id: req.body.user_id,
      device_id: req.body.device_id,
      plant_image: {
        data: fs.readFileSync("uploads/" + req.file.filename),
        contentType: "image/png",
      },
      uploadedTime: currentTimeStamp
    });

    saveImage.save(function (err, ImageGallery){
        if (err) res.send(err);
        else res.send(ImageGallery);
    });
    // saveImage
    //   .save()
    //   .then((res) => {
    //     console.log("image is saved");
    //   })
    //   .catch((err) => {
    //     console.log(err, "error has occur");
    //   });
    //   res.send('image is saved')
  });

  router.get('/getImage',async (req,res)=>{
    const allData = await ImageGallery.find()
    res.json(allData)
  })


  
// const upload = multer({ storage: storage });

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// router.get('/', (req, res) => {
//     ImageGallery.find({user_id: req.body.user_id, device_id: req.body.device_id}, (err, items) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send('An error occurred', err);
//         }
//         else {
//             res.render('imagesPage', { items: items });
//         }
//     });
// });

// router.post('/upload', upload.single('image'), (req, res, next) => {
  
//     const obj = {
//         user_id: imageGalleryData.user_id,
//         device_id: imageGalleryData.device_id,
//         plant_image: {
//             data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
//             contentType: 'image/png'
//         }
//     }
//     ImageGallery.create(obj, (err, item) => {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             // item.save();
//             res.redirect('/');
//         }
//     });
// });


// Batas Rev Lainnya

// router.get('/get-all-images', function (req, res) {
//     ImageGallery.find({user_id: req.body.user_id, device_id: req.body.device_id}, function (err, result) {
//         if (err) {
//             res.send({
//                 "success": false,
//                 "error": err
//             });
//         } else {
//             res.send({
//                 "success": true,
//                 "data": result
//             });
//         }
//     })
// })

// // router.get("/", function (req, res) {
// //     ImageGallery.findOne({ user_id: req.body.user_id, device_id: req.body.device_id }, function (err, data) {
// //     if (!data) {
// //       res.send({ Status: "Can't found" });
// //     } else {
// //       res.send({
// //         user_id: data.user_id,
// //         device_id: data.device_id,
// //         plant_image: data.plant_image,
// //       });
// //     }
// //   });
// // });

// router.post("/add", function (req, res) {
//   const imageGalleryData = req.body;
//   const newImageGallery = new ImageGallery({
//     user_id: imageGalleryData.user_id,
//     device_id: imageGalleryData.device_id,
//     plant_image: imageGalleryData.plant_image,
//   });

//   newImageGallery.save(function (err, ImageGallery) {
//     if (err) res.send(err);
//     else res.send(ImageGallery);
//   });
// });

// router.post('/upload-image', function (req, res) {
//     var date = new Date();
//     var currentTimeStamp = date.getTime();
//     var data = {
//         plant_image: req.body.imageBase64,    // store base64 in database
//         // imageString: userUploadedImagePath,  // store file path in database
//         uploadedTime: currentTimeStamp,
//     }

//     if (req.body.fileType == "image/png" || req.body.fileType == "image/jpeg") {
//         ImageGallery.create(data, function (err, succ) {
//             if (err) {
//                 res.send({
//                     "success": false,
//                     "error": "Failed uploading image"
//                 });
//             } else {
//                 res.send({
//                     "success": true,
//                     "message": "Image uploaded successfully"
//                 });
//             }
//         })
//     } else {
//         res.send({
//             "success": false,
//             "error": "Invalid file type, Please upload only PNG,JEPG,JPG file type",
//             data
//         });
//     }
// });

// router.use(bodyParser.urlencoded({ extended: false }))
// router.use(bodyParser.json())
  
// // Set EJS as templating engine 
// router.set("view engine", "ejs");

export default router;