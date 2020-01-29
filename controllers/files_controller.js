const FileModel = require('./../database/models/file_model');
const aws = require("aws-sdk");
require("dotenv").config();     // config dotenv to load in dotenv file
const multer = require('multer');
const multerS3 = require("multer-s3");

aws.config.update({
    region: "ap-southeast-2",
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey
})

// Create S3 service object
const s3 = new aws.S3({apiVersion: '2006-03-01'});
const s3_Bucket = process.env.Bucket;
const storage = multerS3({
    s3: s3,
    bucket: s3_Bucket,
    key: function (req,file,cb){
        const ext = file.mimetype.split("/")[1];
        cb(null, Date.now() + "."+ ext);
    }
});

const upload = multer({ storage: storage }).single('file');

// save file to db and s3
function saveFile(req, res) {

    upload(req, res, async function (err) {
        const { name, solution, dateCreated, description, prerequisites, whoItBenefits } = req.body;
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        // logic to write into MongoDB
        await FileModel.create({name: name, tags: { solution: solution, createdOn: dateCreated, description: description, prerequisites: prerequisites.split(","), benefits: whoItBenefits.split(",")  }, location: "qwertv" });
      return res.status(200).send(req.file)
    })
}

// retrieve files based on search
function searchFiles(req, res) {

}

// retrieve single file based on selection in returned search
async function show(req,res){
    const {key} = req.params;

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