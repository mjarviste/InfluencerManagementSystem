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
exports.getManager = exports.getManagers = exports.addManager = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const addManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, influencers } = req.body;
    try {
        const manager = yield prisma_1.default.manager.create({
            data: {
                firstName,
                lastName,
                influencers: {
                    create: influencers,
                },
            },
            include: {
                influencers: true,
            },
        });
        res.json(manager);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Can't create a manager" });
    }
});
exports.addManager = addManager;
const getManagers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const managers = yield prisma_1.default.manager.findMany({
            include: { influencers: true, }
        });
        res.status(200).json(managers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Cant get managers" });
    }
});
exports.getManagers = getManagers;
const getManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const manager = yield prisma_1.default.manager.findUnique({
            where: { id },
            include: {
                influencers: true,
            }
        });
        res.status(200).json(manager);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get manager" });
    }
});
exports.getManager = getManager;
//# sourceMappingURL=manager.controller.js.map