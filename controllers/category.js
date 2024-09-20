const Category = require('../models/Category');
const Medicine = require('../models/Medicine')
// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        const result = await category.save();
        res.status(201).json({
            message: 'Category created successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating category',
            error: error.message
        });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving categories',
            error: error.message
        });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const result = await Category.findByIdAndDelete(categoryId);
        if (!result) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }
        res.status(200).json({
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting category',
            error: error.message
        });
    }
};

// Get medicines by category
exports.getMedicinesByCategoryId = async (req, res) => {
    try {
        const medicines = await Medicine.find({ category: req.params.categoryId }).populate('category');
        res.status(200).json({
            data: medicines
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving medicines for category',
            error: error.message
        });
    }
};