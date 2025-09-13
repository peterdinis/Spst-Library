import { Book } from "./bookTypes";

export interface Author {
  id: number;
  name: string;
  bio?: string | null;
  books: Book[];
  litPeriod: string;
  bornDate: string;
  deathDate?: string | null;
  createdAt: string;
  updatedAt: string;
}
