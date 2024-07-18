import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import BookCard from '../components/Books';
import BookDetailsModal from '../components/BooksDetailsModal';
import { Book } from '../lib/gender';

interface Books extends Book {
    key: string;
}

const Books: React.FC = () => {
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

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedBook(null);
    };

    const handleSave = (status: string) => {
        if (selectedBook) {
            fetch('/api/reading-list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: 'current_user_id', // Replace with actual user ID
                    book_id: selectedBook.key,
                    status,
                    action: 'add'
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Book added to reading list:', data);
                // Update the reading list count in the profile
                fetch('/api/profile') // Assuming /api/profile updates the counts
                    .then(response => response.json())
                    .then(profileData => {
                        setReadingLists(profileData.readingLists); // Update the reading lists state
                    });
            })
            .catch(error => {
                console.error('Error adding book to reading list:', error);
            });
        }
    };

    const renderBooks = (books: Book[], genre: string, loadMore: () => void) => (
        <div className="book-genre-container">
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
        <div className="search-results-container">
            <h2>Search Results</h2>
            <div className="search-results-list">
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
            <h1>Books</h1>
            <div className="search-container">
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
                    onClose={handleModalClose} 
                    book={selectedBook} 
                    onSave={handleSave} 
                />
            )}
        </div>
    );
};

export default Books;
function setReadingLists(readingLists: any) {
    throw new Error('Function not implemented.');
}

