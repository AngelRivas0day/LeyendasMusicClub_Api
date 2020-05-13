const express = require('express');
const router = express.Router();

const ordersController = require('../controllers/ordersController');

router.get('/list', ordersController.listAll);
router.post('/create', ordersController.create);
router.get('/list/:id', ordersController.listOne);
router.post('/dataTable/', ordersController.listDataTable);
router.put('/update/:id', ordersController.edit);
router.put('/confirm/:id', ordersController.confirm);
router.put('/delivered/:id', ordersController.delivered);
router.put('/archive/:id', ordersController.archive);
router.delete('/delete/:id', ordersController.delete);

module.exports = router;
