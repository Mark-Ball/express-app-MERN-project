const UserModel = require('./../database/models/user_model');

// write new user to database
async function registerUser(req, res) {
    try {
        req.body.approved = false;
        await UserModel.create(req.body);
        res.sendStatus('200');
    } catch(error) {
        res.send(error);
    }
}

// retrieve users from database

// toggle approval on users

module.exports = {
    registerUser
}