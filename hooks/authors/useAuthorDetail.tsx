import { useQuery } from "@tanstack/react-query";
import { Author } from "@/types/authorTypes";
import { API_BASE_URL } from "@/constants/applicationConstants";

async function fetchAuthor(id: number): Promise<Author> {
  const res = await fetch(`${API_BASE_URL}/authors/${id}`);
  if (!res.ok) {
    throw new Error(`Nepodarilo sa načítať autora s ID ${id}`);
  }
  return res.json();
}

export function useAuthor(id: number | undefined) {
  return useQuery<Author>({
    queryKey: ["author", id],
    queryFn: () => fetchAuthor(id as number),
  });
}
