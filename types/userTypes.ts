import { Order } from "./orderTypes";
import { Role } from "./roleTypes";

export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  roleId: number;
  role: Role;
  orders: Order[];
  createdAt: string;
  updatedAt: string;
}