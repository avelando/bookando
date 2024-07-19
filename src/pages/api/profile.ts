import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = session.user.id;

    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    const { data: followersData, error: followersError } = await supabase
        .from('followers')
        .select('*', { count: 'exact' })
        .eq('following_id', userId);

    const { data: followingData, error: followingError } = await supabase
        .from('followers')
        .select('*', { count: 'exact' })
        .eq('follower_id', userId);

    if (userError || followersError || followingError) {
        return res.status(500).json({ message: 'Error fetching profile data' });
    }

    const profileData = {
        user: userData,
        followers: followersData.length,
        following: followingData.length,
    };

    res.status(200).json(profileData);
}
