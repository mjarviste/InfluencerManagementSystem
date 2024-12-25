import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const addAccount = async (req: Request, res: Response) => {
    const { username, type, influencerId } = req.body;
    try {
        const accountExists = await prisma.account.findFirst({
            where: {
                username,
                type
            }
        })
        if (accountExists) {
            res.status(400).json({message: "Account already exists"});
            return;        
        }
        const account = await prisma.account.create({
            data: {
                username,
                type,
                influencerId,
            },
            include: { influencer: true }
        });
        res.status(200).json(account);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add account" })
    }
}
export const deleteAccount = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const account = await prisma.account.delete({
            where: { id }
        });
        res.status(200).json({ message: "Account deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to delete account" });
    }
}