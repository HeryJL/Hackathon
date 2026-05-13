import express from 'express';
import * as sellerRequestController from '../controllers/sellerRequestController.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

// Routes utilisateur connecté
router.use(authenticate);
router.post('/', upload.single('document'), sellerRequestController.createSellerRequest);
router.get('/', sellerRequestController.getUserSellerRequests);

// Routes administrateur
router.get('/all', isAdmin, sellerRequestController.getAllSellerRequests);
router.put('/:id/process', isAdmin, sellerRequestController.processSellerRequest);

export default router;