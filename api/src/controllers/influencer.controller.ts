import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const addInfluencer = async(req: Request, res: Response) => {
    const {firstName, lastName, avatar, managerId, accounts} = req.body
    if ((firstName as string).length > 50 || (lastName as string).length > 50) {
        res.status(400).json({message: "First name and last name can be maximum 50 characters"});
        return;
    }
    try {
        const influencer = await prisma.influencer.create({
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
    } catch(error) {
        console.error(error);
        res.status(500).json({message: "Failed to create an influencer"});
    }
}

export const getInfluencers = async(req: Request, res: Response) => {
    try {
        const influencers = await prisma.influencer.findMany({
            include: { manager: true, accounts: true},
        });
        res.json(influencers);
    } catch(error) {
        console.error(error);
        res.status(500).json({message: "Failed to get influencers"});
    }
}
export const getInfluencer = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const influencer = await prisma.influencer.findUnique({
            where: {id},
            include: {
                manager: true,
                accounts: true,
            }
        });
        res.status(200).json(influencer);
    } catch(error) {
        console.error(error);
        res.status(500).json({message: "Failed to get influencer"});
    }
}
export const getInfluencersByManager = async (req: Request, res: Response) => {
    const managerId = req.params.managerId;
    try {
        const influencers = prisma.influencer.findMany({
            where: {managerId},
            include: {
                manager: true,
                accounts: true,
            }
        });
        res.status(200).json(influencers);
    } catch(error) {
        res.status(500).json({message: "Failed to get influencers"})
    }
}
export const updateInfluencer = async(req: Request, res: Response) => {
    const id = req.params.id;
    const managerId = req.body.managerId;
    const {firstName, lastName, avatar, accounts} = req.body;
    try {
        const updatedInfluencer = await prisma.influencer.update({
            where: {id},
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
    } catch(error) {
        console.error(error);
        res.status(500).json({message: "Failed to update influencer"});
    }
}
export const deleteInfluencer = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const influencer = await prisma.influencer.delete({
            where: {id}
        });
        res.status(200).json({message: "Influencer deleted"})
    } catch(error) {
        console.error(error)
        res.status(500).json({message: "Failed to delete influencer"})
    }
}
// export const searchInfluencers = async (req: Request, res: Response) => {
//     const name = req.query.name;
//     if(!name || (name as string).length < 2) {
//         return res.status(400).json({ message: 'Search term must be at least 2 characters long' });
//     }
//     try {
//         const influencers = await prisma.influencer.findMany({
//             where: {
//                 OR: [
//                     {firstName: { contains: name as string, mode:'insensitive'}},
//                     {lastName: { contains: name as string, mode:'insensitive'}},
//                 ]
//             },
//             include: {
//                 manager: true,
//                 accounts: true,
//             }
//         });
//         res.status(200).json(influencers)
//     } catch(error) {
//         console.error(error)
//         res.status(500).json({message: "Failed to get influencers"});
//     }
// }