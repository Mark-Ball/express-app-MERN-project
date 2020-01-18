const UserModel = require('./../database/models/user_model');

// write new user to database
async function registerUser(req, res) {
    try {
        const { email, password } = req.body;
        await UserModel.create({email, password, approved: false});
        res.sendStatus('200');
    } catch(error) {
        res.send(error);
    }
}

// log a user in
function login(req, res) {
    res.send('Approved');
}

// retrieve users from database

// toggle approval on users

module.exports = {
    registerUser,
    login
}