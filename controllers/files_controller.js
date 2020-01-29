const FileModel = require('./../database/models/file_model');
const aws = require("aws-sdk");
require("dotenv").config();     // config dotenv to load in dotenv file
const fs = require("fs");

aws.config.update({
    region: "ap-southeast-2",
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey
})

// save file to db and s3
async function saveFile(req, res) {
    try {
        const { name, tags, location } = req.body;

        // creates the object in the database with name, tags and location sent in request
        const file = await FileModel.create({name: name, tags: tags, location: location})
        // if successful sends file back in json format as response
        res.json(file);
    } catch (err){
        // error handling sends back error in response
        res.sendError(err);
    }
}

// retrieve files based on search
async function searchFiles(req, res) {
    const { querySolution, queryBenefits } = req.body;
    let result;
    console.log(queryBenefits, querySolution);
    if(querySolution){
        result = await FileModel.find({ "tags.solution": querySolution });
    } else if (queryBenefits) {
        result = await FileModel.find({"tags.benefits": queryBenefits});
    }   else {
        // result = await FileModel.find();
    }
    res.json(result);
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