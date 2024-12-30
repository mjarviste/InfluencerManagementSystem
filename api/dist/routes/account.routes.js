"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_controller_1 = require("../controllers/account.controller");
const router = express_1.default.Router();
router.get('/', account_controller_1.getAccounts);
router.post('/', account_controller_1.addAccount);
router.delete('/:id', account_controller_1.deleteAccount);
exports.default = router;
//# sourceMappingURL=account.routes.js.map