import React from 'react';
import styles from '../styles/BookDetailsModal.module.css';

interface BookDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: any;
    onSave: (status: string) => void;
}

const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ isOpen, onClose, book, onSave }) => {
    const [status, setStatus] = React.useState<string>('Lido');

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(status);
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{book.title}</h2>
                <p>{book.authors?.join(', ')}</p>
                <img src={`https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`} alt={book.title} />
                <div className={styles.selectContainer}>
                    <label htmlFor="status">Add to list:</label>
                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="Lido">Lido</option>
                        <option value="Lendo">Lendo</option>
                        <option value="Para ler">Para ler</option>
                    </select>
                </div>
                <button onClick={handleSave} className={styles.saveButton}>Save</button>
                <button onClick={onClose} className={styles.closeButton}>Close</button>
            </div>
        </div>
    );
};

export default BookDetailsModal;
