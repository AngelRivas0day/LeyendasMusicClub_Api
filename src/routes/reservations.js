const express = require('express');
const router = express.Router();

const reservationControler = require('../controllers/reservationController');

router.get('/list', reservationControler.listAll);
router.post('/create', reservationControler.create);
router.get('/list/:id', reservationControler.listOne);
router.post('/dataTable/', reservationControler.listDataTable);
router.put('/update/:id', reservationControler.edit);
router.put('/confirm/:id', reservationControler.confirm);
router.put('/achieve/:id', reservationControler.achieve);
router.delete('/delete/:id', reservationControler.delete);

module.exports = router;
