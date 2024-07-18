export interface Book {
    title: string;
    cover_id: number;
    key: string;
    authors: { name: string }[];
    onClick: () => void;
}