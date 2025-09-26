import { API_BASE_URL } from "@/constants/applicationConstants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateOrderItem {
  bookId: number;
  quantity: number;
}

export interface CreateOrderDto {
  userId: string;
  items: CreateOrderItem[];
}

export interface OrderItem {
  id: number;
  bookId: number;
  quantity: number;
  book: {
    id: number;
    name: string;
    isAvailable: boolean;
  };
}

export interface Order {
  id: number;
  userId: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED" | "RETURNED";
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createOrder"],
    mutationFn: async (order: CreateOrderDto): Promise<Order> => {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create order");
      }

      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
}
