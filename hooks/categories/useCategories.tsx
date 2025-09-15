"use client";

import { API_BASE_URL } from "@/constants/applicationConstants";
import { useQuery } from "@tanstack/react-query";

export function useCategories(
  page: number = 1,
  limit: number = 10,
  search?: string,
) {
  return useQuery({
    queryKey: ["categories", { page, limit, search }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search ? { search } : {}),
      });

      const res = await fetch(
        `${API_BASE_URL}/categories?${params.toString()}`,
      );
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      return res.json();
    },
    staleTime: 60_000, // matches your backend cache TTL
  });
}
