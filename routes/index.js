const express = require('express');
const router = express.Router();
const UsersController = require('./../controllers/users_controller');
const FilesController = require('./../controllers/files_controller');
const passport = require('passport');
require('./../config/passport_local');

router.get('/', (req, res) => { res.send('hello world') });
router.post('/newuser', UsersController.registerUser)

// user login authenticated using passport local strategy
router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/loginFailure',
        session: false
    }),
    UsersController.loginSuccess);

// if authentication fails, respond with 'Rejected'
router.get('/loginFailure', UsersController.loginFailure);

module.exports = router;