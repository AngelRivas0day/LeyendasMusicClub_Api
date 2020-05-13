const express = require('express');
const router = express.Router();
const md_auth = require('../middlewares/ensureAuth');
const machineController = require('../controllers/machineController');

router.get('/list', machineController.listAll);
router.post('/dataTable/', machineController.listDataTable);
router.get('/listPerCategory', machineController.listPerCategory);
router.post('/create', md_auth.ensureAuth, machineController.create);
router.get('/list/:id', machineController.listOne);
router.put('/update/:id', md_auth.ensureAuth, machineController.edit);
router.delete('/delete/:id', md_auth.ensureAuth, machineController.delete);
router.put('/update-image/:id', md_auth.ensureAuth, machineController.uploadImage);
router.get('/get-image/:fileName', machineController.getImage);

module.exports = router;
