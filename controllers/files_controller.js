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

// save file to db and s3
async function saveFile(req, res) {
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
    const { querySolution, queryBenefits, queryPrereqs, value, solutionsArr, teamsArr, prereqArr } = req.body;
    let result;
    // console.log(queryBenefits, querySolution, queryPrereqs);
    if(querySolution){
        result = await FileModel.find({ "tags.solution": querySolution });
    } else if (queryBenefits) {
        result = await FileModel.find({"tags.benefits": queryBenefits});
    }   else if (queryPrereqs) {
        result = await FileModel.find({"tags.prerequisites": queryPrereqs});
    }   else if (value[0]){
        const advQuery = [solutionsArr, teamsArr, prereqArr ];
        const test = advQuery.map(arr=>{
            const q = (Array.isArray(arr) && arr.length) ? arr : null ;
            if (q){
                return arr
            }
        })
        dbQuery = {}
        for (let i = 0; i < 3; i++ ){
            if (test[i]){
                // console.log(test[i]);
                switch (i){
                    case 0:
                    dbQuery["tags.solution"] = test[i][test[i].length-1];
                    break;
                    case 1:
                    dbQuery["tags.benefits"] = test[i];
                    break;
                    case 2:
                    dbQuery["tags.prerequisites"] = test[i];
                    break;
                }
            }
        }
        console.log(dbQuery)
        result = await FileModel.find(dbQuery)
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
        res.send("Requested Lesson Does Not Exist");
    })
    stream.pipe(res);
}

module.exports = {
    saveFile,
    searchFiles,
    show
}