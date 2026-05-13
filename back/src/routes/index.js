import express from 'express';
import userRoutes from './userRoutes.js';
import profileRoutes from './profileRoutes.js';
import farmRoutes from './farmRoutes.js';
import productRoutes from './productRoutes.js';
import cartRoutes from './cartRoutes.js';
import orderRoutes from './orderRoutes.js';
import sellerRequestRoutes from './sellerRequestRoutes.js';
import greenhouseRoutes from './greenhouseRoutes.js'
import authRoutes from './authRoutes.js'

const router = express.Router();

router.use('/users', userRoutes);
router.use('/profile', profileRoutes);
router.use('/farms', farmRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/seller-requests', sellerRequestRoutes);
router.use('/metrics',greenhouseRoutes)
router.use('/auth',authRoutes)

export default router;