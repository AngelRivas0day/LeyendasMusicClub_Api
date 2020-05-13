const express = require('express');
const router = express.Router();

const carouselController = require('../controllers/carouselController');
const md_auth = require('../middlewares/ensureAuth');

router.get('/list', carouselController.listAll);
router.post('/create', carouselController.create);
// router.get('/list/:id', carouselController.listOne);
router.put('/update/:id', carouselController.edit);
router.delete('/delete/:id', carouselController.delete);
router.put('/update-image/:id', md_auth.ensureAuth, carouselController.uploadImage);
router.get('/get-image/:fileName', carouselController.getImage);

module.exports = router;
