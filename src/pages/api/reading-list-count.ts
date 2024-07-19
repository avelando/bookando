import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const statuses = ["read", "reading", "to-read"];
        const readingLists: Record<string, number> = {
            read: 0,
            reading: 0,
            "to-read": 0,
        };

        for (const status of statuses) {
            const { count, error } = await supabase
                .from("reading_list")
                .select("id", { count: "exact" })
                .eq("user_id", user_id)
                .eq("status", status);

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            readingLists[status] = count || 0;
        }

        res.status(200).json(readingLists);
    } catch (error) {
        res.status(500).json({ error: "An unexpected error occurred" });
    }
}
