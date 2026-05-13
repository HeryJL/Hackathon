import express from 'express';
import * as greenhouseController from "../controllers/greenhouseController.js"
const router = express.Router()
router.get('/latest', greenhouseController.getLatest);
router.get('/history', greenhouseController.getHistory);
router.get('/',greenhouseController.getHistory)

export default router;