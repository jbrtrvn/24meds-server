const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    genericName: {
        type: String,
        required: [true, 'Generic name is required']
    },
    description: {
        type: String,
        required: [true]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    price: {
        type: Number,
        required: [true]
    },
    stockQuantity: {
        type: Number,
        required: [true]
    },
    expiryDate: {
        type: Date,
        required: [true]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Medicine', medicineSchema);
