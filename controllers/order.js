const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Medicine = require("../models/Medicine");
const { errorHandler } = require("../auth");

module.exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id; // User ID from middleware

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "No cart found for this user." });
    }

    // Check if cart has items
    if (cart.cartItems.length === 0) {
      return res.status(400).json({ error: "No items to checkout." });
    }

    // Create and save the order
    const newOrder = new Order({
      userId: cart.userId,
      productsOrdered: cart.cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
      totalPrice: cart.totalPrice,
    });

    const savedOrder = await newOrder.save();

    // Clear the cart
    cart.cartItems = [];
    cart.totalPrice = 0;
    await cart.save();

    res
      .status(201)
      .json({ message: "Ordered successfully.", order: savedOrder });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

module.exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    if (orders.length > 0) {
      return res.status(200).json({ orders });
    } else {
      return res.status(404).json({ message: "No orders found." });
    }
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

module.exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate({
        path: "userId",
        select: "firstName lastName", // Adjust fields based on your User model
      })
      .populate({
        path: "productsOrdered.productId",
        select: "name", // Adjust fields based on your Medicine model
      });

    if (orders.length > 0) {
      return res.status(200).json({ orders });
    } else {
      return res.status(404).json({ message: "No orders found." });
    }
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

module.exports.processOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId).populate(
      "productsOrdered.productId"
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }
    if (status === "Processed") {
      const updateStockPromises = order.productsOrdered.map(async (product) => {
        const medicine = await Medicine.findById(product.productId._id);

        if (medicine) {
          if (medicine.stockQuantity >= product.quantity) {
            medicine.stockQuantity -= product.quantity;
            await medicine.save();
          } else {
            throw new Error(
              `Insufficient stock for ${medicine.name}. Only ${medicine.stockQuantity} left.`
            );
          }
        }
      });
      await Promise.all(updateStockPromises);
    }
    order.status = status;
    const updatedOrder = await order.save();

    res
      .status(200)
      .json({
        message: "Order processed and stock updated.",
        order: updatedOrder,
      });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};
