import express from 'express';
import { getAllAnalysis, insertFakeData } from '../controllers/analysisController.js';

const router = express.Router();

router.get('/', getAllAnalysis);
router.post('/seed', insertFakeData); 

export default router;