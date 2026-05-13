import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();
router.use(authenticate);

router.post('/', orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/cancel', orderController.cancelOrder);

export default router;