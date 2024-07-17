import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { followerId, followingId } = req.body;

        try {
            console.log("Follow request received:", req.body);
            const { data, error } = await supabase
                .from('followers')
                .insert([{ follower_id: followerId, following_id: followingId }]);

            if (error) {
                console.error("Error creating follow", error);
                return res.status(500).json({ error: 'Error creating follow' });
            }

            res.status(201).json(data);
        } catch (error) {
            console.error("Error processing request", error);
            res.status(500).json({ error: 'Error processing request' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
