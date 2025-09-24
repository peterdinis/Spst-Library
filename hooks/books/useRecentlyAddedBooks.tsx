import { API_BASE_URL } from "@/constants/applicationConstants";
import { Book } from "@/types/bookTypes";
import { useQuery } from "@tanstack/react-query";

async function fetchRecentlyAddedBooks(days: number = 7): Promise<Book[]> {
  const url = new URL(`${API_BASE_URL}/books/recently-added`);
  url.searchParams.set("days", String(days)); 

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch recently added books");
  return res.json();
}

export function useRecentlyAddedBooks(days: number = 7) {
  return useQuery({
    queryKey: ["books", "recently-added", days],
    queryFn: () => fetchRecentlyAddedBooks(days),
  });
}