import { Book } from "./bookTypes";

export interface Category {
  id: number;
  name: string;
  description?: string | null;
  books: Book[];
  createdAt: string;
  updatedAt: string;
}

export type CategoryListResponse = Category[];

export interface CategoryPaginatedResponse {
  data: Category[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
