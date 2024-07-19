export interface Book {
    title: string;
    cover_id: number;
    key: string;
    authors: { name: string }[];
    description: string;
    onClick: () => void;
}

export interface BookDetailsModalProps {
    isOpen: boolean;
    book: Book;
    onClose: () => void;
    onSave: (status: string) => void;
}

export interface BookCardProps {
    key: string;
    title: string;
    cover_id: number | null;
    authors: { name: string }[];
    onClick: () => void;
}