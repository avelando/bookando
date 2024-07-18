import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user_id = req.query.user_id;

    if (req.method === 'GET') {
        const { data, error } = await supabase
            .from('reading_lists')
            .select('status', { count: 'exact' })
            .eq('user_id', user_id);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        const counts = {
            Lidos: data.filter((item: any) => item.status === 'Lidos').length,
            Lendo: data.filter((item: any) => item.status === 'Lendo').length,
            'Para ler': data.filter((item: any) => item.status === 'Para ler').length
        };

        res.status(200).json(counts);
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
