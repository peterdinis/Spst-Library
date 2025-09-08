"use client";

import { useQuery } from "@tanstack/react-query";

export interface Category {
  id: number;
  name: string;
  description: string;
  books: {
    id: number;
    name: string;
  }[];
}

export interface CategoryResponse {
  data: Category[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useCategories(
  page: number = 1,
  limit: number = 10,
  search?: string,
) {
  return useQuery<CategoryResponse>({
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
