import { useQuery } from '@tanstack/react-query';

export interface QueryAuthorParams {
  search?: string;
  page?: number;
  limit?: number;
}

interface Author {
  id: string;
  name: string;
  createdAt: string;
  // pridaj ďalšie polia podľa modelu
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
const fetchAuthors = async (params: QueryAuthorParams): Promise<AuthorsResponse> => {
  const query = new URLSearchParams({
    page: params.page?.toString() || '1',
    limit: params.limit?.toString() || '10',
    search: params.search || '',
  });

  const res = await fetch(`http://localhost:5000/authors?${query.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch authors');
  }
  return res.json();
};

// Hook
export const useAllAuthors = (params: QueryAuthorParams) => {
    return useQuery<AuthorsResponse, Error>({
        queryKey: ["authors", params.search, params.limit, params.page],
        queryFn: () => fetchAuthors(params),
        staleTime: Infinity
    })
}