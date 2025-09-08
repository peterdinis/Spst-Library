import { User } from "./userTypes";

export interface Role {
  id: number;
  name: string;
  users: User[];
}