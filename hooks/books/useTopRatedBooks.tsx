import { API_BASE_URL } from "@/constants/applicationConstants";
import { Book } from "@/types/bookTypes";
import { useQuery } from "@tanstack/react-query";

async function fetchTopRatedBooks(limit: number = 10): Promise<Book[]> {
  const url = new URL(`${API_BASE_URL}/books/top-rated`);
  url.searchParams.set("limit", String(limit)); 

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch top rated books");
  return res.json();
}

export function useTopRatedBooks(limit: number = 10) {
  return useQuery({
    queryKey: ["topRatedBooks", limit],
    queryFn: () => fetchTopRatedBooks(limit),
  });
}