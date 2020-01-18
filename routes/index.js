const express = require('express');
const router = express.Router();
const UsersController = require('./../controllers/users_controller');
const FilesController = require('./../controllers/files_controller');

router.get('/', (req, res) => { res.send('hello world') });
router.post('/newuser', UsersController.registerUser)

module.exports = router;