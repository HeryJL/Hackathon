import express from 'express';
import * as profileController from '../controllers/profileController.js';
import { authenticate } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();
router.use(authenticate);

router.get('/', profileController.getProfile);
router.put('/', upload.single('avatar'), profileController.updateProfile);

export default router;