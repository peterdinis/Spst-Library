import { API_BASE_URL } from "@/constants/applicationConstants";
import { CreateOrderDto, Order } from "@/types/orderTypes";
import { useMutation } from "@tanstack/react-query";

export function useCreateOrder() {
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
  });
}
