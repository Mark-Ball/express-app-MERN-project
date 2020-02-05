const UserModel = require('./../database/models/user_model');
const jwt = require('jsonwebtoken');

// create a JWT based on a payload related to the user and the secret
function createJWT(payload) {
    return jwt.sign({ sub: payload }, process.env.JWT_SECRET);
}

// check if the email is already registered, respond with false if it is
// if email is available, create the user record, respond with jwt
async function registerUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            res.send(false);
            return;
        }

        const newUser = await UserModel.create({ email, password, approved: false, pending: true });
        console.log(newUser);
        const token = createJWT(newUser._id);
        res.json({ token, user: newUser });

    } catch(error) {
        res.sendStatus('400');
    }
}

// correct login details provided, create JWT and send it and user record
function loginSuccess(req, res) {
    const token = createJWT(req.user._id);
    res.json({ token, user: req.user });
}

// respond with 200 status
// middleware has already checked that the user is the admin
function confirmAdmin(req, res) {
    res.sendStatus('200');
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
    confirmAdmin,
    getUsers,
    toggleApproval
}