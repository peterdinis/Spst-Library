import { Author } from "./authorTypes";
import { BookTag } from "./bookTagTypes";
import { Category } from "./categoryTypes";
import { OrderItem } from "./orderTypes";
import { Rating } from "./ratingTypes";

export interface Book {
  id: number;
  name: string;
  description?: string | null;
  year?: number | null;
  isAvailable: boolean;
  isNew: boolean;
  categoryId?: number | null;
  category?: Category | null;
  authorId: number;
  author: Author;
  bookTags: BookTag[];
  ratings: Rating[];
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BooksResponse {
  data: Book[];
  total: number;
  page: number;
  lastPage: number;
}
