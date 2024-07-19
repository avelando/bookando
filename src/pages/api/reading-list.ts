import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { user_id, book_id, title, author, status } = req.body;

        try {
            const { data: existingBook, error: fetchError } = await supabase
                .from('reading_list')
                .select('*')
                .eq('user_id', user_id)
                .eq('book_id', book_id)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                return res.status(500).json({ error: fetchError.message });
            }

            if (existingBook) {
                const { error: updateError } = await supabase
                    .from('reading_list')
                    .update({ status })
                    .eq('id', existingBook.id);

                if (updateError) {
                    return res.status(500).json({ error: updateError.message });
                }

                return res.status(200).json({ message: 'Book status updated' });
            } else {
                const { error: insertError } = await supabase
                    .from('reading_list')
                    .insert([{ user_id, book_id, title, author, status }]);

                if (insertError) {
                    return res.status(500).json({ error: insertError.message });
                }

                return res.status(201).json({ message: 'Book added to reading list' });
            }
        } catch (error) {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
