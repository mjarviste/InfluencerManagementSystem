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
exports.searchInfluencers = exports.deleteInfluencer = exports.updateInfluencer = exports.getInfluencersByManager = exports.getInfluencer = exports.getInfluencers = exports.addInfluencer = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const addInfluencer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, avatar, managerId, accounts } = req.body;
    if (firstName.length > 50 || lastName.length > 50) {
        res.status(400).json({ message: "First name and last name can be maximum 50 characters" });
        return;
    }
    try {
        const influencer = yield prisma_1.default.influencer.create({
            data: {
                firstName,
                lastName,
                avatar,
                managerId,
                accounts: {
                    create: accounts,
                },
            },
            include: {
                manager: true,
                accounts: true,
            },
        });
        res.json(influencer);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create an influencer" });
    }
});
exports.addInfluencer = addInfluencer;
const getInfluencers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const influencers = yield prisma_1.default.influencer.findMany({
            include: { manager: true, accounts: true },
        });
        res.json(influencers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get influencers" });
    }
});
exports.getInfluencers = getInfluencers;
const getInfluencer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const influencer = yield prisma_1.default.influencer.findUnique({
            where: { id },
            include: {
                manager: true,
                accounts: true,
            }
        });
        res.status(200).json(influencer);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get influencer" });
    }
});
exports.getInfluencer = getInfluencer;
const getInfluencersByManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const managerId = req.query.managerId;
    try {
        const influencers = yield prisma_1.default.influencer.findMany({
            where: { managerId: managerId },
            include: {
                manager: true,
                accounts: true,
            }
        });
        res.status(200).json(influencers);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to get influencers" });
    }
});
exports.getInfluencersByManager = getInfluencersByManager;
const updateInfluencer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const managerId = req.body.managerId;
    const { firstName, lastName, avatar, accounts } = req.body;
    try {
        const updatedInfluencer = yield prisma_1.default.influencer.update({
            where: { id },
            data: {
                firstName,
                lastName,
                avatar,
                managerId,
                accounts: {
                    create: accounts,
                },
            },
            include: {
                accounts: true,
                manager: true,
            }
        });
        res.status(200).json(updatedInfluencer);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update influencer" });
    }
});
exports.updateInfluencer = updateInfluencer;
const deleteInfluencer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const influencer = yield prisma_1.default.influencer.delete({
            where: { id }
        });
        res.status(200).json({ message: "Influencer deleted" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete influencer" });
    }
});
exports.deleteInfluencer = deleteInfluencer;
const searchInfluencers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.query.name;
    if (!name || name.length < 2) {
        res.status(400).json({ message: 'Search term must be at least 2 characters long' });
        return;
    }
    try {
        const influencers = yield prisma_1.default.influencer.findMany({
            where: {
                OR: [
                    { firstName: { contains: name, mode: 'insensitive' } },
                    { lastName: { contains: name, mode: 'insensitive' } },
                ]
            },
            include: {
                manager: true,
                accounts: true,
            }
        });
        res.status(200).json(influencers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get influencers" });
    }
});
exports.searchInfluencers = searchInfluencers;
//# sourceMappingURL=influencer.controller.js.map