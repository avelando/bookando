import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { userId, bookId } = req.body;

        try {
        const { data, error } = await supabase
            .from('user_books')
            .insert([{ user_id: userId, book_id: bookId }]);

        if (error) {
            console.error("Error creating user-book relation", error);
            return res.status(500).json({ error: 'Error creating user-book relation' });
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
