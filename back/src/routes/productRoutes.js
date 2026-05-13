import express from 'express';
import * as productController from '../controllers/productController.js';
import { authenticate } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

// Routes publiques (consultation)
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Routes protégées (écriture)
router.use(authenticate);
router.post('/', upload.array('images', 5), productController.createProduct);
router.put('/:id', upload.array('images', 5), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;