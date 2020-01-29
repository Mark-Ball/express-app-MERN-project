const FileModel = require('./../database/models/file_model');
const aws = require("aws-sdk");
require("dotenv").config();     // config dotenv to load in dotenv file
const fs = require("fs");
const multer = require('multer');

aws.config.update({
    region: "ap-southeast-2",
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname )
    }
});

const upload = multer({ storage: storage }).single('file');

// save file to db and s3
function saveFile(req, res) {

    upload(req, res, function (err) {
        console.log(req.body);
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        // logic to write into MongoDB

      return res.status(200).send(req.file)
    })
}

// retrieve files based on search
function searchFiles(req, res) {

}

// retrieve single file based on selection in returned search
async function show(req,res){
    const {key} = req.params;

    const s3_Bucket = process.env.Bucket;

    // Create S3 service object
    const s3 = new aws.S3({apiVersion: '2006-03-01'});

    // Call S3 to get an object creates readable stream for display on the front end
    const stream = await s3.getObject({Bucket: s3_Bucket, Key: key}).createReadStream();
    stream.on("error", (err)=>{
        console.log(err);
        res.end(err);
    })
    stream.pipe(res);
}

module.exports = {
    saveFile,
    searchFiles,
    show
}