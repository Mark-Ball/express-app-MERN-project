const UserModel = require('./../database/models/user_model');
const jwt = require('jsonwebtoken');

// write new user to database
async function registerUser(req, res) {
    try {
        const { email, password } = req.body;
        await UserModel.create({email, password, approved: false});
        res.sendStatus('200');
    } catch(error) {
        res.sendStatus('400');
    }
}

// correct login details provided, respond with 200 status code
function loginSuccess(req, res) {
    const token = jwt.sign({ sub: req.user._id }, process.env.JWT_SECRET);
    res.json(token);
    res.sendStatus('200');
}

// retrieve users from database

// toggle approval on users

module.exports = {
    registerUser,
    loginSuccess
}