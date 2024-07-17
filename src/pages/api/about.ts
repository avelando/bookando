import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("About API hit");
    res.status(200).json({ message: 'Data for About page' });
}
