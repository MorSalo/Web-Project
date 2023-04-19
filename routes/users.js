const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.route('/')
    .get(usersController.getUsers)
    .post(usersController.createUser)

router.route('/:id')
    .put(usersController.updateUser)
    .delete(usersController.deleteUser)

router.route('/auth')
    .post(usersController.validateUser)

router.route('/username/:username?/email/:email?/isAdmin/:isAdmin?')
    .get(usersController.findUsers);

router.route('/get/user')
    .get(usersController.getUser);
    
module.exports = router;