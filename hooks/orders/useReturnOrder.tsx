import { API_BASE_URL } from "@/constants/applicationConstants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ReturnOrderResponse {
  id: number;
  status: string;
  items: any[];
}

export const useReturnOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<ReturnOrderResponse, Error, number>({
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
    onSuccess: (_, orderId) => {
      // Invalidate or refetch orders query
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
};
