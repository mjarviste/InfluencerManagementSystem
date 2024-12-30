"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const influencer_controller_1 = require("../controllers/influencer.controller");
const router = express_1.default.Router();
router.get('/', influencer_controller_1.getInfluencers);
router.get('/search', influencer_controller_1.searchInfluencers);
router.get('/by-manager', influencer_controller_1.getInfluencersByManager);
router.get('/:id', influencer_controller_1.getInfluencer);
router.post('/', influencer_controller_1.addInfluencer);
router.put('/:id', influencer_controller_1.updateInfluencer);
router.delete('/:id', influencer_controller_1.deleteInfluencer);
exports.default = router;
//# sourceMappingURL=influencer.routes.js.map