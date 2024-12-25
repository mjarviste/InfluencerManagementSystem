import express from 'express';
import { addInfluencer, getInfluencers, getInfluencer, updateInfluencer, deleteInfluencer, getInfluencersByManager} from '../controllers/influencer.controller';

const router = express.Router();

router.get('/', getInfluencers);
router.get('/:id', getInfluencer);
// router.get('/search', searchInfluencers);
router.get('/by-manager/:managerId', getInfluencersByManager);
router.post('/', addInfluencer);
router.put('/:id', updateInfluencer);
router.delete('/:id', deleteInfluencer);


export default router;