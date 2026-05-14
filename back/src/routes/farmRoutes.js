import express from 'express';
import * as farmController from '../controllers/farmController.js';
import { authenticate } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();
router.use(authenticate);

router.post('/', upload.array('images', 5), farmController.createFarm);
router.get('/', farmController.getUserFarms);
router.get('/:id', farmController.getFarmById);
router.put('/:id', upload.array('images', 5), farmController.updateFarm);
router.patch('/:id', upload.array('images', 5), farmController.updateFarm);
router.delete('/:id', farmController.deleteFarm);

export default router;