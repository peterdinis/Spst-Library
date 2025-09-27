import { API_BASE_URL } from "@/constants/applicationConstants";
import { Order } from "@/types/orderTypes";
import { useQuery } from "@tanstack/react-query";

const fetchOrdersByUser = async (userId: string): Promise<Order[]> => {
  const res = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }
  return res.json();
};

export const useOrdersByUser = (userId: string) => {
  return useQuery<Order[], Error>({
    queryKey: ["orders", userId],
    queryFn: () => fetchOrdersByUser(userId),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });
};
