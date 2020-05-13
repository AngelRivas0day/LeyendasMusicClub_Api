const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController');

router.get('/list', eventController.listAll);
router.post('/create', eventController.create);
router.get('/list/:id', eventController.listOne);
router.put('/update/:id', eventController.edit);
router.delete('/delete/:id', eventController.delete);
router.post('/update-image/:id', eventController.uploadImage);
router.get('/get-image/:fileName', eventController.getImage);

module.exports = router;
