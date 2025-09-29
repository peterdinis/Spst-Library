import { Book } from "./bookTypes";
import { User } from "./userTypes";

export interface Order {
  id: number;
  userId: number;
  user: User;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  order: Order;
  bookId: number;
  book: Book;
  quantity: number;
}

export enum OrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface CreateOrderItem {
  bookId: number;
  quantity: number;
}

export interface CreateOrderDto {
  userId: string;
  items: CreateOrderItem[];
}
