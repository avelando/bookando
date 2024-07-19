import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import BookCard from '../components/Books';
import BookDetailsModal from '../components/BooksDetailsModal';
import { useSession } from 'next-auth/react';
import { Book } from '../lib/gender';

interface BooksProps extends Book {
    key: string;
}

const Books: React.FC = () => {
    const { data: session } = useSession();
    const [fictionBooks, setFictionBooks] = useState<Book[]>([]);
    const [romanceBooks, setRomanceBooks] = useState<Book[]>([]);
    const [suspenseBooks, setSuspenseBooks] = useState<Book[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Book[]>([]);
    const [fictionOffset, setFictionOffset] = useState<number>(0);
    const [romanceOffset, setRomanceOffset] = useState<number>(0);
    const [suspenseOffset, setSuspenseOffset] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const fetchBooks = (genre: string, offset: number, setBooks: React.Dispatch<React.SetStateAction<Book[]>>, setOffset: React.Dispatch<React.SetStateAction<number>>) => {
        setIsLoading(true);
        fetch(`/api/books?genre=${genre}&offset=${offset}`)
            .then(response => response.json())
            .then(data => {
                setBooks(prevBooks => [...prevBooks, ...data.books]);
                setOffset(prevOffset => prevOffset + 10);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching books:", error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchBooks('fiction', fictionOffset, setFictionBooks, setFictionOffset);
        fetchBooks('romance', romanceOffset, setRomanceBooks, setRomanceOffset);
        fetchBooks('suspense', suspenseOffset, setSuspenseBooks, setSuspenseOffset);
    }, []);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchClick = () => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        fetch(`/api/books?search=${searchQuery}`)
            .then(response => response.json())
            .then(data => {
                const booksWithCovers = data.books.map((book: any) => {
                    if (book.cover_i) {
                        book.cover_id = book.cover_i;
                    } else {
                        book.cover_id = null;
                    }
                    return book;
                });
                setSearchResults(booksWithCovers);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching search results:", error);
                setIsLoading(false);
            });
    };

    const handleBookClick = (book: Book) => {
        setSelectedBook(book);
        setIsModalOpen(true);
    };

    const handleSaveBook = async (status: string) => {
        if (!session || !session.user || !selectedBook) return;

        try {
            const response = await fetch('/api/reading-list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: session.user.id,
                    book_id: selectedBook.key,
                    title: selectedBook.title,
                    author: selectedBook.authors.map((author) => author.name).join(', '),
                    status,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save the book');
            }

            console.log('Book saved successfully');
        } catch (error) {
            console.error('Error saving book:', error);
        }
    };

    const renderBooks = (books: Book[], genre: string, loadMore: () => void) => (
        <div className="genre-section">
            <h2>{genre}</h2>
            <div className="book-list">
                {books.map(book => (
                    <BookCard 
                        key={book.key} 
                        title={book.title} 
                        cover_id={book.cover_id} 
                        authors={book.authors} 
                        onClick={() => handleBookClick(book)}
                    />
                ))}
            </div>
            <button 
                onClick={loadMore} 
                className="load-more-button"
                disabled={isLoading}
            >
                {isLoading ? 'Loading...' : 'Load More'}
            </button>
        </div>
    );

    const renderSearchResults = () => (
        <div className="search-results">
            <h2>Search Results</h2>
            <div className="search-book-list">
                {searchResults.map(book => (
                    <BookCard 
                        key={book.key} 
                        title={book.title} 
                        cover_id={book.cover_id} 
                        authors={book.authors} 
                        onClick={() => handleBookClick(book)}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div>
            <Header />
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Search by title, author, or genre" 
                    value={searchQuery} 
                    onChange={handleSearch} 
                    className="search-input"
                />
                <button 
                    onClick={handleSearchClick} 
                    className="search-button"
                >
                    Search
                </button>
            </div>
            <div>
                {searchResults.length > 0 ? (
                    renderSearchResults()
                ) : (
                    <>
                        {renderBooks(fictionBooks, 'Fiction', () => fetchBooks('fiction', fictionOffset, setFictionBooks, setFictionOffset))}
                        {renderBooks(romanceBooks, 'Romance', () => fetchBooks('romance', romanceOffset, setRomanceBooks, setRomanceOffset))}
                        {renderBooks(suspenseBooks, 'Suspense', () => fetchBooks('suspense', suspenseOffset, setSuspenseBooks, setSuspenseOffset))}
                    </>
                )}
            </div>
            {selectedBook && (
                <BookDetailsModal
                    isOpen={isModalOpen}
                    book={selectedBook}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveBook}
                />
            )}
        </div>
    );
};

export default Books;
