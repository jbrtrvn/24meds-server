const Cart = require("../models/Cart.js");
const Medicine = require("../models/Medicine.js");
const { errorHandler } = require("../auth.js");

module.exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate('cartItems.productId');
    if (!cart || cart.cartItems.length === 0) {
      return res.status(404).json({ message: "Your cart is empty" });
    }
    return res.status(200).json({ cart });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

module.exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const product = await Medicine.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, cartItems: [] });
    }

    const cartItem = cart.cartItems.find(item => item.productId.toString() === productId);

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.subtotal = cartItem.quantity * product.price;
    } else {
      cart.cartItems.push({
        productId,
        quantity,
        subtotal: product.price * quantity,
      });
    }

    cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

    await cart.save();
    return res.status(200).json({ message: "Medicine added to cart", cart });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

module.exports.updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const product = await Medicine.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "No cart found" });
    }

    const cartItem = cart.cartItems.find(item => item.productId.toString() === productId);

    if (cartItem) {
      cartItem.quantity = quantity;
      cartItem.subtotal = product.price * quantity;
    } else {
      return res.status(404).json({ message: "Medicine not found in cart" });
    }

    cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

    await cart.save();
    return res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

module.exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "No cart found" });
    }

    cart.cartItems = cart.cartItems.filter(item => item.productId.toString() !== productId);

    cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

    await cart.save();
    return res.status(200).json({ message: "Item removed from the cart successfully", cart });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

module.exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "No cart found" });
    }

    if (cart.cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is already empty" });
    }

    cart.cartItems = [];
    cart.totalPrice = 0;

    await cart.save();
    return res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

