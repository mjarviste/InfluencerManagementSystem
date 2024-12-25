import express from 'express';
import { addManager, getManagers, getManager } from '../controllers/manager.controller';

const router = express.Router();

router.get('/', getManagers);
router.get('/:id', getManager);
router.post('/', addManager);

export default router;