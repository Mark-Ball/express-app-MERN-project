const UserModel = require('./../database/models/user_model');
const jwt = require('jsonwebtoken');

// create a JWT based on a payload related to the user and the secret
function createJWT(payload) {
    return jwt.sign({ sub: payload }, process.env.JWT_SECRET);
}

// write new user to database
async function registerUser(req, res) {
    try {
        // destructuring used to create email and password variables from req.body
        const { email, password } = req.body;
        // email and password variables used to create entry in user collection of database
        const { _id } = await UserModel.create({ email, password, approved: false, pending: true });
        // create a JWT based on the id the user just created
        const token = createJWT(_id);
        // if successful, respond with the JWT
        res.json(token);
        // catch block included in case of error interfacing with MongoDB
    } catch(error) {
        // send 400 status in case of error
        res.sendStatus('400');
    }
}

// correct login details provided, create JWT and send
function loginSuccess(req, res) {
    // create the JWT using the user's unique MongoDB id and secret frm .env file
    // const token = jwt.sign({ sub: req.user._id }, process.env.JWT_SECRET);
    const token = createJWT(req.user._id);
    // respond with the JWT as json
    res.json(token);
}

// retrieve users from database
async function getUsers(req, res) {
    try {
        // query the database for all users
        const users = await UserModel.find();
        // respond with all users as JSON
        res.json(JSON.stringify(users));
    } catch(error) {
        // if there is an error, respond with 400 status
        res.sendStatus('400');
    }
}

// toggle approval on specific user
async function toggleApproval(req, res) {
    try {
        // the user document to update is identified by the id on the request
        const { id } = req.body;
        // get the user document
        let { approved } = await UserModel.findById(id);
        // reverse the approval status
        approved = !approved;
        // update the document with new approval status
        // updateOne will return an object if successful, else return nothing
        const updateSucceeded = await UserModel.updateOne({ _id: id }, { approved: approved, pending: false });
        // if update was successful, respond with 200 status
        if (updateSucceeded) {
            res.sendStatus('200');
        // if update unsuccessful, respond with 400 status
        } else {
            res.sendStatus('400');
        }
    } catch(error) {
        // if there is an error, respond with 400 status
        res.sendStatus('400');
    }
}

module.exports = {
    registerUser,
    loginSuccess,
    getUsers,
    toggleApproval
}