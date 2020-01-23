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
        const { _id } = await UserModel.create({ email, password, approved: false });
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

// toggle approval on users

module.exports = {
    registerUser,
    loginSuccess
}