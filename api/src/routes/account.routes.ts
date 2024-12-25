import express from 'express';
import { addAccount, deleteAccount } from '../controllers/account.controller';

const router = express.Router();

router.post('/', addAccount);
router.delete('/:id', deleteAccount);

export default router;