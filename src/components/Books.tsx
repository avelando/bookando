import React from "react";
import styles from "../styles/Books.module.css";
import { BookCardProps } from "../lib/gender";
import Image from "next/image";

const BookCard: React.FC<BookCardProps> = ({ title, cover_id, authors, onClick }) => {
    const renderAuthors = () => {
        if (!authors) {
            return "Unknown Author";
        }
        if (Array.isArray(authors) && typeof authors[0] === "string") {
            return authors.join(", ");
        }
        if (Array.isArray(authors) && typeof authors[0] === "object") {
            return authors.map(author => author.name).join(", ");
        }
        return "Unknown Author";
    };

    const imageUrl = cover_id ? `https://covers.openlibrary.org/b/id/${cover_id}-L.jpg` : null;
    console.log(`BookCard image URL for ${title}:`, imageUrl);

    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.imageContainer}>
                {imageUrl ? (
                    <Image src={imageUrl} alt={title} width={128} height={192} priority />
                ) : (
                    <div className={styles.noImage}>No Image</div>
                )}
            </div>
            <div className={styles.textContainer}>
                <h3>{title}</h3>
                <p>{renderAuthors()}</p>
            </div>
        </div>
    );
};

export default BookCard;
