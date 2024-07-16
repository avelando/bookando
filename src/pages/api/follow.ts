import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { followerId, followingId } = req.body;

    const follow = await prisma.follower.create({
      data: {
        followerId,
        followingId,
      },
    });

    res.status(201).json(follow);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
