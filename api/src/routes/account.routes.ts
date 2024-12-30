import express from 'express';
import { addAccount, deleteAccount, getAccounts } from '../controllers/account.controller';

const router = express.Router();

router.get('/', getAccounts);
router.post('/', addAccount);
router.delete('/:id', deleteAccount);

export default router;