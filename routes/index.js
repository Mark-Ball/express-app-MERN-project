const express = require('express');
const router = express.Router();
const UsersController = require('./../controllers/users_controller');
const FilesController = require('./../controllers/files_controller');
const passport = require('passport');
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
router.get('/testPrivate', passport.authenticate('jwt', { session: false }), (req, res) => { res.send('Access granted') });

// get route to get all users
router.get('/users', UsersController.getUsers);
// post route to toggle the approval status on a user


module.exports = router;