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
