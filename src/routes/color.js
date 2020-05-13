const express = require('express');
const router = express.Router();

const colorsController = require('../controllers/colorController');

router.get('/list', colorsController.listAll);
router.post('/create', colorsController.create);
router.get('/list/:id', colorsController.listOne);
router.post('/dataTable/', colorsController.listDataTable);
router.put('/update/:id', colorsController.edit);
router.delete('/delete/:id', colorsController.delete);

module.exports = router;
