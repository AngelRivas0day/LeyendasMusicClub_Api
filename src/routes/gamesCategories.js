const express = require('express');
const router = express.Router();
const md_auth = require('../middlewares/ensureAuth');
const gamesCategoriesController = require('../controllers/gamesCategoriesController');

router.get('/list', gamesCategoriesController.listAll);
router.post('/dataTable/', gamesCategoriesController.listDataTable);
router.post('/create', md_auth.ensureAuth, gamesCategoriesController.create);
router.get('/list/:id', gamesCategoriesController.listOne);
router.put('/update/:id', md_auth.ensureAuth, gamesCategoriesController.edit);
router.delete('/delete/:id', md_auth.ensureAuth, gamesCategoriesController.delete);

module.exports = router;
