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
// variable used as a unique variable name to be stored in bucket
const fileName = Date.now();
const storage = multerS3({
    s3: s3,
    bucket: s3_Bucket,
    key: function (req,file,cb){
        const ext = file.mimetype.split("/")[1];
        cb(null, fileName + "."+ ext);
    }
});

const upload = multer({ storage: storage }).single('file');

// save file to db and s3
async function saveFile(req, res) {
    console.log("working?");
    upload(req, res, async function (err) {
        const { name, solution, dateCreated, proficiency, lessonContent, description, prerequisites, whoItBenefits } = req.body;
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }

        // logic to write into MongoDB
        await FileModel.create({
            name: name, tags: { solution: solution, createdOn: dateCreated, proficiency: proficiency, content: lessonContent, 
            description: description, prerequisites: prerequisites.split(","), benefits: whoItBenefits.split(",")  }, location: fileName + ".pdf" 
        });
      return res.status(200).send(req.file)
    })
}

// retrieve files based on search
async function searchFiles(req, res) {
    const { querySolution, queryBenefits, queryPrereqs } = req.body;
    let result;
    console.log(queryBenefits, querySolution, queryPrereqs);
    if(querySolution){
        result = await FileModel.find({ "tags.solution": querySolution });
    } else if (queryBenefits) {
        result = await FileModel.find({"tags.benefits": queryBenefits});
    }   else if (queryPrereqs) {
        result = await FileModel.find({"tags.prerequisites": queryPrereqs});
    }
    res.json(result);
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