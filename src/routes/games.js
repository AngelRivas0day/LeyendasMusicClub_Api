const express = require('express');
const router = express.Router();
const md_auth = require('../middlewares/ensureAuth');
const gameController = require('../controllers/gamesController');

router.get('/list', gameController.listAll);
router.post('/dataTable/', gameController.listDataTable);
router.get('/listPerCategory', gameController.listPerCategory);
router.post('/create', md_auth.ensureAuth, gameController.create);
router.get('/list/:id', gameController.listOne);
router.put('/update/:id', md_auth.ensureAuth, gameController.edit);
router.delete('/delete/:id', md_auth.ensureAuth, gameController.delete);
router.put('/update-image/:id', md_auth.ensureAuth, gameController.uploadImage);
router.get('/get-image/:fileName', gameController.getImage);

module.exports = router;
