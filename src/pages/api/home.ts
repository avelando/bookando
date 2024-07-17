import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("Home API hit");
    res.status(200).json({ message: 'Data for Home page' });
}
