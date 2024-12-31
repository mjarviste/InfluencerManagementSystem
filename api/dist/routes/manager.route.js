"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const manager_controller_1 = require("../controllers/manager.controller");
const router = express_1.default.Router();
router.get('/', manager_controller_1.getManagers);
router.post('/', manager_controller_1.addManager);
router.get('/:id', manager_controller_1.getManager);
exports.default = router;
//# sourceMappingURL=manager.route.js.map