const Medicine = require('../models/Medicine');

// Create a new medicine
exports.createMedicine = async (req, res) => {
    try {
        const medicine = new Medicine(req.body);
        const result = await medicine.save();
        res.status(201).json({
            message: 'Medicine created successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating medicine',
            error: error.message
        });
    }
};

// Get all active medicines
exports.getAllMedicine = async (req, res) => {
    try {
        const medicines = await Medicine.find().populate('category');
        res.status(200).json({
            data: medicines
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving medicines',
            error: error.message
        });
    }
};

// Get medicine by ID
exports.getMedicineById = (req, res) => {
    const { medicineId } = req.params;
    console.log('Fetching medicine with ID:', medicineId);
    Medicine.findById(medicineId)
        .then(medicine => {
            if (!medicine || !medicine.isActive) {
                return res.status(404).json({ message: 'Medicine not found' });
            }
            res.status(200).json({ data: medicine });
        })
        .catch(err => {
            console.log('Error retrieving medicine:', err);
            res.status(500).json({ message: 'Error retrieving medicine', error: err.message });
        });
};

// Archive (Deactivate) a medicine
exports.archiveMedicine = async (req, res) => {
    try {
        const result = await Medicine.findByIdAndUpdate(req.params.medicineId, { isActive: false }, { new: true });
        if (!result) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.status(200).json({ message: 'Medicine archived successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error archiving medicine', error: error.message });
    }
};

// Unarchive (reactivate) a medicine
exports.activateMedicine = async (req, res) => {
    try {
        const { medicineId } = req.params;

        // Find the medicine and update its isActive field to true
        const medicine = await Medicine.findByIdAndUpdate(medicineId, { isActive: true }, { new: true });

        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        res.status(200).json({ data: medicine });
    } catch (error) {
        res.status(500).json({ message: 'Error reactivating medicine', error: error.message });
    }
};


// Update Medicine
exports.updateMedicine = async (req, res) => {
    try {
        const { medicineId } = req.params;
        const updates = req.body;

        // Find and update medicine
        const medicine = await Medicine.findByIdAndUpdate(medicineId, updates, { new: true });
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        res.status(200).json({ data: medicine });
    } catch (error) {
        console.error('Error updating medicine:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
