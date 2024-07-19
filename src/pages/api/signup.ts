import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const { data, error } = await supabase
        .from("users")
        .insert([{ name, email, password: hashedPassword }]);

      if (error) {
        return res.status(500).json({ error: "User already exists or an error occurred" });
      }

      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
