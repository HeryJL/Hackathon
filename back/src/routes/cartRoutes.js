import express from 'express';
import * as cartController from '../controllers/cartController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/cart', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/item', cartController.updateCartItem);
router.delete('/', cartController.clearCart);

export default router;