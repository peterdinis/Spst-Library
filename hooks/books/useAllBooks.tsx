import { useQuery } from "@tanstack/react-query";

export interface QueryBooksDto {
  search?: string;
  page?: number;
  limit?: number;
}

interface Book {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  author: any;
  ratings: any[];
  category: any;
  bookTags: any[];
}

interface BooksResponse {
  data: Book[];
  total: number;
  page: number;
  lastPage: number;
}

async function fetchBooks(params: QueryBooksDto): Promise<BooksResponse> {
  const query = new URLSearchParams();

  if (params.search) query.append("search", params.search);
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());

  const res = await fetch(`http://localhost:5000/books?${query.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }
  return res.json();
}

export function useBooks(params: QueryBooksDto) {
  return useQuery({
    queryKey: ["books", params],
    queryFn: () => fetchBooks(params),
    staleTime: Infinity
  });
}
