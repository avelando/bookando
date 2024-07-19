import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('email', session.user.email)
        .single();

    if (error) {
        return res.status(500).json({ error: 'Error fetching profile' });
    }

    res.status(200).json(data);
}
