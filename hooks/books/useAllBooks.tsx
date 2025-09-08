import { BooksResponse } from "@/types/bookTypes";
import { QueryTypeDto } from "@/types/globalTypes";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchBooks(params: QueryTypeDto): Promise<BooksResponse> {
  const query = new URLSearchParams();

  if (params.search) query.append("search", params.search);
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());

  const res = await fetch(`${API_BASE_URL}/books?${query.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }
  return res.json();
}

export function useBooks(params: QueryTypeDto) {
  return useQuery({
    queryKey: ["books", params],
    queryFn: () => fetchBooks(params),
    staleTime: Infinity,
  });
}
