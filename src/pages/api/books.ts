import { NextApiRequest, NextApiResponse } from 'next';

const fetchBooks = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    return data.docs || data.works;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { genre, offset, search } = req.query;
        let books;

        if (search) {
            books = await fetchBooks(`https://openlibrary.org/search.json?q=${search}&limit=30`);
        } else {
            const offsetNumber = parseInt(offset as string, 10) || 0;
            books = await fetchBooks(`https://openlibrary.org/subjects/${genre}.json?limit=10&offset=${offsetNumber}`);
        }

        res.status(200).json({ books });
    } catch (error) {
        console.error("Error fetching books from Open Library:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
