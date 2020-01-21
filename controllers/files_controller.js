const FileModel = require('./../database/models/file_model');
const aws = require("aws-sdk");
require("dotenv").config();     // config dotenv to load in dotenv file

aws.config.update({
    region: "ap-southeast-2",
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey
})

// save file to db and s3
function saveFile(req, res) {

}

// retrieve files based on search
function searchFiles(req, res) {

}

function show(req,res){
    const s3_Bucket = process.env.Bucket;

    // Create S3 service object
    const s3 = new aws.S3({apiVersion: '2006-03-01'});

    // Call S3 to list the buckets
    s3.getObject({Bucket: s3_Bucket, Key: "dummy.pdf"}, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        return res.send(data.Body);
    }
});
}

module.exports = {
    saveFile,
    searchFiles,
    show
}