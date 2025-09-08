"use client";

import { CategoryResponse } from "@/types/categoryTypes";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useNotFilterCategories() {
  return useQuery<CategoryResponse>({
    queryKey: ["filteredCategories"],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE_URL}/categories/all`,
      );
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      return res.json();
    },
    staleTime: 60_000,
  });
}
