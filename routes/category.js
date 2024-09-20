const express = require('express');
const { verify, verifyAdmin } = require('../auth');
const categoryController = require('../controllers/category');

const router = express.Router();

// Category Routes
router.get('/', categoryController.getAllCategories);
router.get('/:categoryId', categoryController.getMedicinesByCategoryId);
router.post('/create', verify, verifyAdmin, categoryController.createCategory);
router.delete('/delete/:categoryId', verify, verifyAdmin, categoryController.deleteCategory);

module.exports = router;
