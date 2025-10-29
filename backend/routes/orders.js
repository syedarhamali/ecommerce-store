const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/', auth, [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product').isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('paymentMethod').isIn(['abhipay', 'card', 'cash_on_delivery']).withMessage('Invalid payment method')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, shippingAddress, billingAddress, paymentMethod, notes } = req.body;

    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res.status(400).json({ 
          message: `Product ${item.product} not found or inactive` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for product ${product.name}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
        image: product.images[0]?.url || ''
      });
    }

    // Calculate shipping cost (you can implement your own logic)
    const shippingCost = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shippingCost + tax;

    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      total,
      notes
    });

    await order.save();

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const filter = { user: req.user._id };
    if (status) filter.orderStatus = status;

    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .populate('items.product', 'name images')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.product', 'name images description');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error fetching order' });
  }
});

// Cancel order
router.put('/:id/cancel', auth, [
  body('reason').optional().trim().isLength({ max: 500 }).withMessage('Reason must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reason } = req.body;
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({ 
        message: 'Order cannot be cancelled at this stage' 
      });
    }

    // Update order status
    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    if (reason) order.cancellationReason = reason;

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    await order.save();

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error cancelling order' });
  }
});

// Update payment status (for webhook)
router.put('/:id/payment', async (req, res) => {
  try {
    const { paymentId, status, transactionId, gateway } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = status;
    order.paymentId = paymentId;
    order.paymentDetails = {
      transactionId,
      gateway,
      amount: order.total,
      currency: 'USD',
      status
    };

    if (status === 'paid') {
      order.orderStatus = 'confirmed';
    }

    await order.save();

    res.json({
      message: 'Payment status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ message: 'Server error updating payment status' });
  }
});

// Get order statistics for user
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({ user: req.user._id });
    const pendingOrders = await Order.countDocuments({ 
      user: req.user._id, 
      orderStatus: 'pending' 
    });
    const deliveredOrders = await Order.countDocuments({ 
      user: req.user._id, 
      orderStatus: 'delivered' 
    });

    const totalSpent = await Order.aggregate([
      { $match: { user: req.user._id, orderStatus: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalSpent: totalSpent[0]?.total || 0
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ message: 'Server error fetching order statistics' });
  }
});

module.exports = router;
