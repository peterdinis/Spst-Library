import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface QueryAuthorParams {
  search?: string;
  page?: number;
  limit?: number;
}

interface Author {
  id: string;
  name: string;
  createdAt: string;
}

interface AuthorsResponse {
  data: Author[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Funkcia pre fetchovanie autorov
const fetchAuthors = async (
  params: QueryAuthorParams,
): Promise<AuthorsResponse> => {
  const query = new URLSearchParams({
    page: params.page?.toString() || "1",
    limit: params.limit?.toString() || "10",
    search: params.search || "",
  });
  const res = await fetch(`${API_BASE_URL}/authors?${query.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch authors");
  }
  return res.json();
};

// Hook
export const useAllAuthors = (params: QueryAuthorParams) => {
  return useQuery<AuthorsResponse, Error>({
    queryKey: ["authors", params.search, params.limit, params.page],
    queryFn: () => fetchAuthors(params),
    staleTime: Infinity,
  });
};
