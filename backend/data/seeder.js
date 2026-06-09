const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
require('dotenv').config();

const products = [
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI.',
    price: 24990,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 15,
    rating: 4.8,
    numReviews: 142,
  },
  {
    name: 'Apple AirPods Pro (2nd Gen)',
    description: 'Active Noise Cancellation, Adaptive Transparency, Personalized Spatial Audio.',
    price: 19900,
    image: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 22,
    rating: 4.7,
    numReviews: 289,
  },
  {
    name: 'Samsung 4K Smart TV 55"',
    description: 'Crystal 4K Processor, HDR, Dynamic Crystal Color, Smart Hub with streaming apps.',
    price: 54990,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 8,
    rating: 4.5,
    numReviews: 76,
  },
  {
    name: 'Nike Air Max 270',
    description: 'Inspired by two icons of big Air, the Nike Air Max 270 delivers a very comfortable ride.',
    price: 8995,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    category: 'Footwear',
    stock: 30,
    rating: 4.4,
    numReviews: 213,
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'Feel an incredible energy return with every step. Responsive BOOST midsole.',
    price: 12999,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop',
    category: 'Footwear',
    stock: 18,
    rating: 4.6,
    numReviews: 167,
  },
  {
    name: 'Levi\'s 511 Slim Fit Jeans',
    description: 'Classic slim fit jeans with a modern touch. Sits below the waist with a slim leg.',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
    category: 'Clothing',
    stock: 45,
    rating: 4.3,
    numReviews: 320,
  },
  {
    name: 'The Alchemist - Paulo Coelho',
    description: 'A magical story about following your dreams and listening to your heart. Timeless classic.',
    price: 399,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
    category: 'Books',
    stock: 60,
    rating: 4.9,
    numReviews: 1024,
  },
  {
    name: 'Atomic Habits - James Clear',
    description: 'An easy and proven way to build good habits and break bad ones. #1 Bestseller.',
    price: 499,
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=400&fit=crop',
    category: 'Books',
    stock: 55,
    rating: 4.8,
    numReviews: 876,
  },
  {
    name: 'Philips Air Fryer HD9200',
    description: 'Up to 90% less fat with Rapid Air Technology. 4.1L family-size capacity.',
    price: 6995,
    image: 'https://images.unsplash.com/photo-1648170292697-1c69e6a6e3c5?w=400&h=400&fit=crop',
    category: 'Kitchen',
    stock: 12,
    rating: 4.5,
    numReviews: 98,
  },
  {
    name: 'Prestige Electric Kettle',
    description: '1.7L capacity, 1500W, auto cut-off, concealed heating element. Boil in 90 seconds.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1594913620965-3b0f1daa7d70?w=400&h=400&fit=crop',
    category: 'Kitchen',
    stock: 0,
    rating: 4.2,
    numReviews: 54,
  },
  {
    name: 'boAt Rockerz 255 Pro+',
    description: 'Wireless in-ear earphone with 40 hours battery, ASAP Charge, BT 5.0.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 35,
    rating: 4.1,
    numReviews: 445,
  },
  {
    name: 'Wildcraft Backpack 45L',
    description: 'Durable water-resistant backpack ideal for trekking, travel, and college.',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: 'Accessories',
    stock: 20,
    rating: 4.3,
    numReviews: 131,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartcart');
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    await User.deleteMany({});

    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ ${insertedProducts.length} products seeded`);

    // Create a test user
    await User.create({
      name: 'Test User',
      email: 'test@smartcart.com',
      password: 'password123',
    });
    console.log('✅ Test user created: test@smartcart.com / password123');

    mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder error:', err);
    process.exit(1);
  }
};

seedDB();
