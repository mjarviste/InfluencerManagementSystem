"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.addAccount = exports.getInfluencerAccounts = exports.getAccounts = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield prisma_1.default.account.findMany({});
        res.status(200).json(account);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get accounts" });
    }
});
exports.getAccounts = getAccounts;
const getInfluencerAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const accounts = yield prisma_1.default.account.findMany({
            where: { influencerId: id },
        });
        res.status(200).json(accounts);
    }
    catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ message: 'Failed to fetch accounts' });
    }
});
exports.getInfluencerAccounts = getInfluencerAccounts;
const addAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, type, influencerId } = req.body;
    try {
        const accountExists = yield prisma_1.default.account.findFirst({
            where: {
                username,
                type
            }
        });
        if (accountExists) {
            res.status(400).json({ message: "Account already exists" });
            return;
        }
        const account = yield prisma_1.default.account.create({
            data: {
                username,
                type,
                influencerId,
            },
            include: { influencer: true }
        });
        res.status(200).json(account);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add account" });
    }
});
exports.addAccount = addAccount;
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const account = yield prisma_1.default.account.delete({
            where: { id }
        });
        res.status(200).json({ message: "Account deleted" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete account" });
    }
});
exports.deleteAccount = deleteAccount;
//# sourceMappingURL=account.controller.js.map