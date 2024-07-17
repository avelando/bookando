import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        if (!SECRET_KEY) {
            console.error("JWT_SECRET_KEY is not defined");
            return res.status(500).json({ error: 'JWT_SECRET_KEY is not defined' });
        }

        try {
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error || !user) {
                console.error("Error fetching user", error);
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            if (user && await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
                console.log("User authenticated, token generated");
                res.status(200).json({ token });
            } else {
                res.status(401).json({ error: 'Invalid email or password' });
            }
        } catch (error) {
            console.error("Error processing login request", error);
            res.status(500).json({ error: 'Error processing login request' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
