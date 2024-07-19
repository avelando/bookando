import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Image from "next/image";
import { BookDetailsModalProps } from "../lib/gender";
import styles from "../styles/BookDetailsModal.module.css";

const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ isOpen, book, onClose, onSave }) => {
    const [status, setStatus] = useState<string>("");

    useEffect(() => {
        if (book && isOpen) {
            setStatus("");
        }
    }, [book, isOpen]);

    const handleSave = () => {
        onSave(status);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Book Details" className={styles.modal} overlayClassName={styles.overlay}>
            <div className={styles.modalContent}>
                <div className={styles.imageContainer}>
                    {book?.cover_id ? (
                        <Image src={`https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`} alt={book.title} width={200} height={300} className={styles.bookImage} />
                    ) : (
                        <div className={styles.noImage}>No Image</div>
                    )}
                </div>
                <div className={styles.detailsContainer}>
                    <h2 className={styles.bookTitle}>{book?.title}</h2>
                    <p className={styles.bookAuthors}><strong>Author(s):</strong> {book?.authors?.map(author => author.name).join(", ") || "Unknown"}</p>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className={styles.statusSelect}>
                        <option value="">Select status</option>
                        <option value="read">Read</option>
                        <option value="reading">Reading</option>
                        <option value="to-read">To Read</option>
                    </select>
                    <button onClick={handleSave} className={styles.saveButton}>Save</button>
                </div>
            </div>
        </Modal>
    );
};

export default BookDetailsModal;
