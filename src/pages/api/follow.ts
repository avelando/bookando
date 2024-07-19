import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { follower_id, following_id, action } = req.body;

    if (req.method === "POST") {
        if (action === "follow") {
            const { error } = await supabase
                .from("followers")
                .insert([{ follower_id, following_id }]);
            if (error) return res.status(500).json({ error: error.message });
            return res.status(200).json({ message: "User followed successfully" });
        } else if (action === "unfollow") {
            const { error } = await supabase
                .from("followers")
                .delete()
                .match({ follower_id, following_id });
            if (error) return res.status(500).json({ error: error.message });
            return res.status(200).json({ message: "User unfollowed successfully" });
        }
    }
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
