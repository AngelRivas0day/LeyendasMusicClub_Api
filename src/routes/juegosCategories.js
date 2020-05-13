const express = require('express');
const router = express.Router();
const md_auth = require('../middlewares/ensureAuth');
const juegosCategoriesController = require('../controllers/juegosCategoriesController');

router.get('/list', juegosCategoriesController.listAll);
router.post('/dataTable/', juegosCategoriesController.listDataTable);
router.post('/create', md_auth.ensureAuth, juegosCategoriesController.create);
router.get('/list/:id', juegosCategoriesController.listOne);
router.put('/update/:id', md_auth.ensureAuth, juegosCategoriesController.edit);
router.delete('/delete/:id', md_auth.ensureAuth, juegosCategoriesController.delete);

module.exports = router;
