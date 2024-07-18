import React from 'react';
import styles from '../styles/Books.module.css';
import { Book } from '../lib/gender';

const BookCard: React.FC<Book> = ({ title, cover_id, authors, onClick }) => {
    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.imageContainer}>
                {cover_id ? (
                    <img src={`https://covers.openlibrary.org/b/id/${cover_id}-L.jpg`} alt={title} />
                ) : (
                    <div className={styles.noImage}>No Image</div>
                )}
            </div>
            <div className={styles.textContainer}>
                <h3>{title}</h3>
                <p>{authors.map(author => author.name).join(', ')}</p>
            </div>
        </div>
    );
};

export default BookCard;