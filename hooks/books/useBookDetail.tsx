import { API_BASE_URL } from "@/constants/applicationConstants";
import { Book } from "@/types/bookTypes";
import { useQuery } from "@tanstack/react-query";

async function fetchBook(id: number): Promise<Book> {
  if (!id || id < 1) {
    throw new Error("Invalid book ID");
  }

  const res = await fetch(`${API_BASE_URL}/books/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch book with id ${id}`);
  }

  return res.json();
}

export function useBook(id: number) {
  return useQuery({
    queryKey: ["bookDetail", id],
    queryFn: () => fetchBook(id),
    enabled: !!id && id > 0,
    staleTime: 60_000, 
  });
}
