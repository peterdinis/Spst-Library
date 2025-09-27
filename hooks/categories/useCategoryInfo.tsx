import { API_BASE_URL } from "@/constants/applicationConstants";
import { Category } from "@/types/categoryTypes";
import { useQuery } from "@tanstack/react-query";

async function fetchCategory(id: number): Promise<Category> {
  if (!id || id < 1) {
    throw new Error("Invalid book ID");
  }

  const res = await fetch(`${API_BASE_URL}/categories/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch category with id ${id}`);
  }

  return res.json();
}

export function useCategoryInfo(id: number) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => fetchCategory(id),
    enabled: !!id && id > 0,
    staleTime: 60_000,
  });
}
