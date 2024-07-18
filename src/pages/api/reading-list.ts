import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { user_id, book_id, status, action } = req.body;

    if (req.method === 'POST') {
        if (action === 'add') {
            const { error } = await supabase
                .from('reading_lists')
                .insert([{ user_id, book_id, status }]);
            if (error) return res.status(500).json({ error: error.message });
            return res.status(200).json({ message: 'Book added to reading list' });
        } else if (action === 'remove') {
            const { error } = await supabase
                .from('reading_lists')
                .delete()
                .match({ user_id, book_id });
            if (error) return res.status(500).json({ error: error.message });
            return res.status(200).json({ message: 'Book removed from reading list' });
        }
    }
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
