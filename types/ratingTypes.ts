import { Book } from "./bookTypes";

export interface Rating {
  id: number;
  bookId: number;
  book: Book;
  value: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRatingDto {
  bookId: number;
  value: number;
  comment?: string;
}