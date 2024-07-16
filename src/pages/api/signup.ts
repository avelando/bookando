// pages/api/signup.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: 'User already exists' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
