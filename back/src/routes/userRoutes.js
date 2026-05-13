import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/', userController.getUsers);          // → admin seulement (à protéger plus tard)
router.get('/me', userController.getMe);
router.put('/me', userController.updateUser);

export default router;