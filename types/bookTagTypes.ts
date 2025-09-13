import { Book } from "./bookTypes";

export interface BookTag {
  id: number;
  name: string;
  books: Book[];
  createdAt: string;
  updatedAt: string;
}
