const Order = require('../models/Order');
const Product = require('../models/Product');

// Discount calculation logic
const calculateDiscounts = (cartItems) => {
  let totalAmount = 0;
  let productDiscountTotal = 0;
  const processedItems = [];

  // Rule 1: 10% off per product if qty >= 3
  for (const item of cartItems) {
    const subtotal = item.price * item.quantity;
    let productDiscount = 0;

    if (item.quantity >= 3) {
      productDiscount = subtotal * 0.1;
    }

    const discountedSubtotal = subtotal - productDiscount;
    totalAmount += subtotal;
    productDiscountTotal += productDiscount;

    processedItems.push({
      ...item,
      subtotal,
      productDiscount,
      discountedSubtotal,
    });
  }

  const afterProductDiscount = totalAmount - productDiscountTotal;

  // Rule 2: 5% off if cart > ₹5000
  let cartDiscount = 0;
  if (totalAmount > 5000) {
    cartDiscount = afterProductDiscount * 0.05;
  }

  // Bonus Rule (Option B): Cheapest item 50% off
  let bulkDiscount = 0;
  if (processedItems.length > 0) {
    const cheapestItem = processedItems.reduce((min, item) =>
      item.price < min.price ? item : min
    );
    bulkDiscount = cheapestItem.price * 0.5;
  }

  const finalAmount = afterProductDiscount - cartDiscount - bulkDiscount;

  return {
    processedItems,
    totalAmount,
    productDiscountTotal,
    cartDiscount,
    bulkDiscount,
    finalAmount: Math.max(0, finalAmount),
  };
};

// POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, guestEmail } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Validate products and stock
    const cartItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      cartItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const { processedItems, totalAmount, productDiscountTotal, cartDiscount, bulkDiscount, finalAmount } =
      calculateDiscounts(cartItems);

    const order = await Order.create({
      user: req.user ? req.user._id : undefined,
      guestEmail,
      items: processedItems,
      totalAmount,
      productDiscountTotal,
      cartDiscount,
      bulkDiscount,
      finalAmount,
      shippingAddress,
    });

    // Deduct stock
    for (const item of cartItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/orders/calculate (preview discounts without placing order)
exports.calculateOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const cartItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product not found` });
      cartItems.push({ price: product.price, quantity: item.quantity, name: product.name });
    }

    const result = calculateDiscounts(cartItems);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
