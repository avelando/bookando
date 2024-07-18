import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user_id = req.query.user_id;

    if (req.method === 'GET') {
        const { data: followers, error: followersError } = await supabase
            .from('followers')
            .select('*', { count: 'exact' })
            .eq('following_id', user_id);
        
        const { data: following, error: followingError } = await supabase
            .from('followers')
            .select('*', { count: 'exact' })
            .eq('follower_id', user_id);

        if (followersError || followingError) {
            return res.status(500).json({ error: followersError || followingError });
        }

        res.status(200).json({ followers: followers.length, following: following.length });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
