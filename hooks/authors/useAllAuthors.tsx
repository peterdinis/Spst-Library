import { API_BASE_URL } from "@/constants/applicationConstants";
import { useQuery } from "@tanstack/react-query";

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
