export interface Book {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  author: any;
  ratings: any[];
  category: any;
  bookTags: any[];
}

export interface BooksResponse {
  data: Book[];
  total: number;
  page: number;
  lastPage: number;
}