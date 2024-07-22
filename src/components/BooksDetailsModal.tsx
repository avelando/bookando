import React from "react";
import styles from "../styles/BookDetailsModal.module.css";
import Modal from "react-modal";
import { BookDetailsModalProps } from "../lib/gender";
import Image from "next/image";

const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ isOpen, book, onClose, onSave }) => {
    const [status, setStatus] = React.useState<string>("");
    
    Modal.setAppElement("#__next");
    
    const handleSave = () => {
        onSave(status);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Book Details" className={styles.modal} overlayClassName={styles.overlay}>
            <div className={styles.modalContent}>
                <div className={styles.imageContainer}>
                    {book.cover_id ? (
                        <Image src={`https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`} alt={book.title} width={128} height={192} priority />
                    ) : (
                        <div className={styles.noImage}>No Image</div>
                    )}
                </div>
                <div className={styles.detailsContainer}>
                    <h2 className={styles.bookTitle}>{book.title}</h2>
                    <p className={styles.bookAuthors}><strong>Author(s):</strong> {book.authors.map(author => author.name).join(", ")}</p>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className={styles.statusSelect}>
                        <option value="">&lsquo;Select status&lsquo;</option>
                        <option value="read">&rsquo;Read&lsquo;</option>
                        <option value="reading">&rsquo;Reading&lsquo;</option>
                        <option value="to-read">&rsquo;To Read&lsquo;</option>
                    </select>
                    <button onClick={handleSave} className={styles.saveButton}>&rsquo;Save&lsquo;</button>
                </div>
            </div>
        </Modal>
    );
};

export default BookDetailsModal;
