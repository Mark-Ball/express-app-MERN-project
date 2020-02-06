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

        const date = new Date();
        const newUser = await UserModel.create({ email, password, dateCreated: date, approved: false, pending: true });
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

// retrieve users from database
async function getUsers(req, res) {
    try {
        const users = await UserModel.find();
        res.json(JSON.stringify(users));
    } catch(error) {
        res.sendStatus('400');
    }
}

// toggle approval on specific user, if successful respond with 200 status
async function toggleApproval(req, res) {
    try {
        const { id } = req.body;
        let { approved } = await UserModel.findById(id);
        approved = !approved;
        const updateSucceeded = await UserModel.updateOne({ _id: id }, { approved: approved, pending: false });

        if (updateSucceeded) {
            res.sendStatus('200');
        } else {
            res.sendStatus('400');
        }
    } catch(error) {
        res.sendStatus('400');
    }
}

module.exports = {
    registerUser,
    loginSuccess,
    getUsers,
    toggleApproval
}