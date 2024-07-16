// pages/api/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ token });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
