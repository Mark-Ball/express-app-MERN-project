const express = require('express');
const router = express.Router();
const UsersController = require('./../controllers/users_controller');
const FilesController = require('./../controllers/files_controller');
const passport = require('passport');
const adminAuth = require('./../config/admin_auth');
require('./../config/passport');

// test route
router.get('/', (req, res) => { res.send('hello world') });

// register and login routes
router.post('/newuser', UsersController.registerUser);
router.post('/login', passport.authenticate('local', { session : false }), UsersController.loginSuccess);

// files routes
router.post("/category", FilesController.searchFiles);
router.get("/file/:key", FilesController.show);

// admin routes
router.get('/confirmAdmin', passport.authenticate('jwt', { session: false }), adminAuth, UsersController.confirmAdmin);

// admin users functionality
router.get('/users', passport.authenticate('jwt', { session: false }), adminAuth, UsersController.getUsers);
router.post('/toggleApproval', passport.authenticate('jwt', { session: false }), adminAuth, UsersController.toggleApproval);

// admin files functionality
router.post('/file/upload', passport.authenticate('jwt', { session: false }), adminAuth, FilesController.saveFile);

module.exports = router;