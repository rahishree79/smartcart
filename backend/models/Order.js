const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  productDiscount: { type: Number, default: 0 },
  discountedSubtotal: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guestEmail: { type: String },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    productDiscountTotal: { type: Number, default: 0 },
    cartDiscount: { type: Number, default: 0 },
    bulkDiscount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'confirmed',
    },
    shippingAddress: {
      name: String,
      address: String,
      city: String,
      pincode: String,
      phone: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
