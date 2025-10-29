const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Upload image to Cloudinary
const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(file.buffer);
  });
};

// Get dashboard stats
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    
    // Get recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get sales data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentOrdersData = await Order.find({
      createdAt: { $gte: thirtyDaysAgo },
      orderStatus: { $in: ['delivered', 'shipped'] }
    });

    const totalSales = recentOrdersData.reduce((sum, order) => sum + order.total, 0);

    res.json({
      stats: {
        totalProducts,
        activeProducts,
        totalUsers,
        totalOrders,
        pendingOrders,
        totalSales
      },
      recentOrders
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
});

// Create product
router.post('/products', adminAuth, upload.array('images', 5), [
  body('name').trim().isLength({ min: 1 }).withMessage('Product name is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      price,
      originalPrice,
      category,
      subcategory,
      brand,
      sku,
      stock,
      isFeatured,
      tags,
      specifications,
      dimensions,
      weight,
      seo
    } = req.body;

    // Upload images to Cloudinary
    const images = [];
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const result = await uploadToCloudinary(req.files[i]);
        images.push({
          url: result.secure_url,
          alt: `${name} image ${i + 1}`,
          isPrimary: i === 0
        });
      }
    }

    // Parse JSON fields
    const parsedSpecifications = specifications ? JSON.parse(specifications) : [];
    const parsedDimensions = dimensions ? JSON.parse(dimensions) : {};
    const parsedWeight = weight ? JSON.parse(weight) : {};
    const parsedSeo = seo ? JSON.parse(seo) : {};
    const parsedTags = tags ? JSON.parse(tags) : [];

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      images,
      category,
      subcategory,
      brand,
      sku,
      stock: parseInt(stock),
      isFeatured: isFeatured === 'true',
      tags: parsedTags,
      specifications: parsedSpecifications,
      dimensions: parsedDimensions,
      weight: parsedWeight,
      seo: parsedSeo
    });

    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

// Update product
router.put('/products/:id', adminAuth, upload.array('images', 5), [
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Product name cannot be empty'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateData = { ...req.body };

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = [];
      for (let i = 0; i < req.files.length; i++) {
        const result = await uploadToCloudinary(req.files[i]);
        newImages.push({
          url: result.secure_url,
          alt: `${updateData.name || product.name} image ${i + 1}`,
          isPrimary: product.images.length === 0 && i === 0
        });
      }
      updateData.images = [...product.images, ...newImages];
    }

    // Parse JSON fields if they exist
    if (updateData.specifications) {
      updateData.specifications = JSON.parse(updateData.specifications);
    }
    if (updateData.dimensions) {
      updateData.dimensions = JSON.parse(updateData.dimensions);
    }
    if (updateData.weight) {
      updateData.weight = JSON.parse(updateData.weight);
    }
    if (updateData.seo) {
      updateData.seo = JSON.parse(updateData.seo);
    }
    if (updateData.tags) {
      updateData.tags = JSON.parse(updateData.tags);
    }

    // Convert numeric fields
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.originalPrice) updateData.originalPrice = parseFloat(updateData.originalPrice);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
});

// Delete product
router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
      try {
        const publicId = image.url.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

// Get all products (admin view)
router.get('/products', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      isActive,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const filter = {};
    if (search) filter.$text = { $search: search };
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total
      }
    });
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

// Get single product (admin view)
router.get('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get admin product error:', error);
    res.status(500).json({ message: 'Server error fetching product' });
  }
});

// Get all orders
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const filter = {};
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .populate('user', 'name email')
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
    console.error('Get admin orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// Update order status
router.put('/orders/:id/status', adminAuth, [
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  body('trackingNumber').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, trackingNumber, notes } = req.body;
    const updateData = { orderStatus: status };

    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (notes) updateData.notes = notes;

    if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    } else if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error updating order status' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      isActive
    } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalUsers: total
      }
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

module.exports = router;
