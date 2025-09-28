import { API_BASE_URL } from "@/constants/applicationConstants";
import { useMutation } from "@tanstack/react-query";

interface ReturnOrderResponse {
  id: number;
  status: string;
  items: unknown[];
}

export const useReturnOrder = () => {
  return useMutation<ReturnOrderResponse, Error, number>({
    mutationKey: ["returnOrder"],
    mutationFn: async (orderId: number) => {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/return`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to return order");
      }
      return res.json();
    },
  });
};
