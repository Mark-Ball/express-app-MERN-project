const express = require('express');
const router = express.Router();
const UsersController = require('./../controllers/users_controller');
const FilesController = require('./../controllers/files_controller');
const passport = require('passport');
const adminAuth = require('./../config/admin_auth');
require('./../config/passport');

router.get('/', (req, res) => { res.send('hello world') });
router.post('/newuser', UsersController.registerUser);

// user login authenticated using passport local strategy
// passport responds with 400-series status codes if authenticate fails
router.post('/login', 
    passport.authenticate('local', { session : false }),
    UsersController.loginSuccess
);

// a route to test that restricting access using a JWT is working
router.get('/testPrivate', passport.authenticate('jwt', { session: false }), adminAuth, (req, res) => { res.send('Access granted') });

// get route to get all users
// put authorisation in here so only admin can see it
router.get('/users', UsersController.getUsers);
// post route to toggle the approval status on a user
// put authorisation in here so only admin can see it
router.post('/toggleApproval', UsersController.toggleApproval);

module.exports = router;