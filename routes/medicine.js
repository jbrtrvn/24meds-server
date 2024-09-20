const express = require('express');
const { verify, verifyAdmin } = require('../auth');
const medicineController = require('../controllers/medicine');

const router = express.Router();

// Medicine Routes
router.get('/', medicineController.getAllMedicine);
router.get('/:medicineId', medicineController.getMedicineById);
router.post('/create', verify, verifyAdmin, medicineController.createMedicine);
router.put('/archive/:medicineId', verify, verifyAdmin, medicineController.archiveMedicine);
router.put('/activate/:medicineId', verify, verifyAdmin, medicineController.activateMedicine);
router.put('/update/:medicineId', verify, verifyAdmin, medicineController.updateMedicine);

module.exports = router;
