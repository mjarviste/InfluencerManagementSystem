import express from 'express';
import { addManager, getManagers, getManager } from '../controllers/manager.controller';

const router = express.Router();

router.get('/', getManagers);
router.post('/', addManager);
router.get('/:id', getManager);

export default router;