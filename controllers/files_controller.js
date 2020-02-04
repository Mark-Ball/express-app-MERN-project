const FileModel = require('./../database/models/file_model');
const aws = require("aws-sdk");
require("dotenv").config();     // config dotenv to load in dotenv file
const multer = require('multer');
const multerS3 = require("multer-s3");

// configures aws resource region and verifies access and secret keys 
aws.config.update({
    region: "ap-southeast-2",
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey
});

// Create S3 service object
const s3 = new aws.S3({apiVersion: '2006-03-01'});
const s3_Bucket = process.env.Bucket;

// save file to db and s3
function saveFile(req, res) {
    // gets current time to use as unique id for s3 key
    const fileName = Date.now();

    // saves file to s3 bucket
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
        };

        try {
            // logic to write into MongoDB
            await FileModel.create({
                name: name, tags: { solution: solution, createdOn: dateCreated, proficiency: proficiency, content: lessonContent, 
                description: description, prerequisites: prerequisites.split(","), benefits: whoItBenefits.split(",")  }, location: fileName + ".pdf" 
            });
            return res.status(200).send(req.file);
        } catch(err) {
            res.send(err);
        }
    });
};

// retrieve files based on search
async function searchFiles(req, res) {
    const { querySolution, queryBenefits, queryPrereqs, value, solutionsArr, teamsArr, prereqArr } = req.body;
    let result;
    try {
        if(querySolution){
            console.log(querySolution);
            result = await FileModel.find({ "tags.solution": querySolution });
        } else if (queryBenefits) {
            result = await FileModel.find({"tags.benefits": queryBenefits});
        }   else if (queryPrereqs) {
            result = await FileModel.find({"tags.prerequisites": queryPrereqs});
        }   else if (value[0]){
            const advQuery = [solutionsArr, teamsArr, prereqArr ];
            dbQuery = {};
            for (let i = 0; i < 3; i++ ){
                if (advQuery[i][0]){
                    switch (i){
                        case 0:
                            const shorten = advQuery[i].map(solution=> solution.match(/(?<=\().*(?=\))/));
                            const solutions = shorten.map(solution=>solution[0]);
                            dbQuery["tags.solution"] = solutions;
                        break;
                        case 1:
                            dbQuery["tags.benefits"] = advQuery[i];
                        break;
                        case 2:
                            dbQuery["tags.prerequisites"] = advQuery[i];
                        break;
                    };
                };
            };
            result = await FileModel.find(dbQuery);
        };} catch (err) {
            res.send(err);
        };
        res.json(result);
};

// retrieve single file based on selection in returned search
async function show(req,res){
    const {key} = req.params;

    // Call S3 to get an object creates readable stream for display on the front end
    const stream = await s3.getObject({Bucket: s3_Bucket, Key: key}).createReadStream();
    stream.on("error", (err)=>{
        console.log(err);
        res.status("400").send("Requested Lesson Does Not Exist");
    })
    stream.pipe(res);
}

module.exports = {
    saveFile,
    searchFiles,
    show
}