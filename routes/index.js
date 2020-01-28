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

router.post("/createFile", FilesController.saveFile);

router.post("/category", FilesController.searchFiles);

// file retriever that gets the corresponding file dependant on the key 
router.get("/file/:key", FilesController.show);

// a route to test that restricting access using a JWT is working
router.get('/testPrivate', passport.authenticate('jwt', { session: false }), (req, res) => { res.send('Access granted') });

module.exports = router;