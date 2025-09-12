import { useQuery } from "@tanstack/react-query"
import { Author } from "@/types/authorTypes" 

async function fetchAuthor(id: number): Promise<Author> {
  const res = await fetch(`/authors/${id}`)
  if (!res.ok) {
    throw new Error(`Nepodarilo sa načítať autora s ID ${id}`)
  }
  return res.json()
}

export function useAuthor(id: number | undefined) {
  return useQuery<Author>({
    queryKey: ["author", id],
    queryFn: () => fetchAuthor(id as number),
    enabled: !!id && id > 0,
    staleTime: 60_000,
    retry: 1 
  })
}
