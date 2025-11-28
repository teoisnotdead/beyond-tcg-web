export interface NewsArticle {
    id: string;
    title: string;
    excerpt?: string;
    imageUrl?: string | null;
    tag: string;
    author: string;
    date: string;
    href?: string;
}
