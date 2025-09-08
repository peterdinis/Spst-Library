import { Book } from "@/types/bookTypes";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
    queryKey: ["book", id],
    queryFn: () => fetchBook(id),
    enabled: !!id && id > 0, // fetch sa spustí iba ak id existuje a je validné
    staleTime: 60_000, // rovnaké ako cache TTL na serveri
  });
}
