import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const addManager = async (req: Request, res: Response) => {
    const {firstName, lastName, influencers} = req.body;
    try {
        const manager = await prisma.manager.create({
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
    } catch(error) {
        console.error(error);
        res.status(400).json({message: "Can't create a manager"});
    }
}
export const getManagers = async (req: Request, res: Response) => {
    try {
        const managers = await prisma.manager.findMany({
            include: {influencers: true,}
        });
        res.status(200).json(managers);
    } catch (error) {
        console.error(error);
        res.status(404).json({message: "Cant get managers"});
    }
}
export const getManager = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const manager = await prisma.manager.findUnique({
            where: {id},
            include: {
                influencers: true,
            }
        });
        res.status(200).json(manager);
    } catch(error) {
        console.error(error);
        res.status(500).json({message: "Failed to get manager"});
    }
}