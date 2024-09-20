const express = require("express");
const orderController = require("../controllers/order");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

// Order routes
router.post('/checkout', verify, orderController.checkOut);
router.get('/my-orders', verify, orderController.getOrders);
router.get('/all-orders', verify, verifyAdmin, orderController.getAllOrders);
router.put('/process/:orderId', verify, verifyAdmin, orderController.processOrder);

module.exports = router;
