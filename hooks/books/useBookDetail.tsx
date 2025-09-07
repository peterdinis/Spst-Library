import { useQuery } from "@tanstack/react-query"

export interface Book {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    author: any;
    ratings: any[];
    category: any;
    bookTags: any[];
}

async function fetchBook(id: number): Promise<Book> {
    if (!id || id < 1) {
        throw new Error("Invalid book ID")
    }

    const res = await fetch(`http://localhost:5000/books/${id}`)
    if (!res.ok) {
        throw new Error(`Failed to fetch book with id ${id}`)
    }

    return res.json()
}

export function useBook(id: number) {
    return useQuery({
        queryKey: ["book", id],
        queryFn: () => fetchBook(id),
        enabled: !!id && id > 0, // fetch sa spustí iba ak id existuje a je validné
        staleTime: 60_000, // rovnaké ako cache TTL na serveri
    })
}
