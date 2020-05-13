const express = require('express');
const router = express.Router();

const userController = require('../controllers/usersController');

router.get('/list', userController.list);
router.post('/create', userController.add);
router.get('/list/:id', userController.edit);
router.post('/update/:id', userController.update);
router.get('/delete/:id', userController.delete);

module.exports = router;
