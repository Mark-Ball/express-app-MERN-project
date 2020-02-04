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

router.post("/createFile", FilesController.saveFile);
// get route to return whether the request came from the admin
router.get('/confirmAdmin', passport.authenticate('jwt', { session: false }), adminAuth, UsersController.confirmAdmin);

router.post("/category", FilesController.searchFiles);

// file retriever that gets the corresponding file dependant on the key 
router.get("/file/:key", FilesController.show);

router.post('/file/upload', passport.authenticate('jwt', { session: false }), adminAuth, FilesController.saveFile);

// get route to get all users
router.get('/users', passport.authenticate('jwt', { session: false }), adminAuth, UsersController.getUsers);

// post route to toggle the approval status on a user
router.post('/toggleApproval', passport.authenticate('jwt', { session: false }), adminAuth, UsersController.toggleApproval);

module.exports = router;