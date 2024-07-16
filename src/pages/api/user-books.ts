import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { userId, bookId } = req.body;

        const userBook = await prisma.userBook.create({
			data: {
				userId,
				bookId,
			},
      });

        res.status(201).json(userBook);
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
