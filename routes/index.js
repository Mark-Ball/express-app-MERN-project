const express = require('express');
const router = express.Router();
const UsersController = require('./../controllers/users_controller');
const FilesController = require('./../controllers/files_controller');
const passport = require('passport');
require('./../config/passport');

router.get('/', (req, res) => { res.send('hello world') });
router.post('/newuser', UsersController.registerUser)

// user login authenticated using passport local strategy
// passport responds with 400-series status codes if authenticate fails
router.post('/login', 
    passport.authenticate('local', { session : false }),
    UsersController.loginSuccess
);

module.exports = router;