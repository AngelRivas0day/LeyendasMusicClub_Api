const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const md_auth = require('../middlewares/ensureAuth');

router.get('/list', productController.list);
router.get('/list-new', productController.listNewItems);
router.post('/dataTable/', productController.listDataTable);
router.post('/create', md_auth.ensureAuth, productController.add);
router.get('/list/:id', productController.edit);
router.put('/update/:id', md_auth.ensureAuth, productController.update);
router.delete('/delete/:id', md_auth.ensureAuth, productController.delete);
router.post('/update-image/:id', md_auth.ensureAuth, productController.uploadImage);
router.get('/get-image/:fileName', productController.getImage);

router.post('/update-images/:id', productController.multipleImage);

module.exports = router;
