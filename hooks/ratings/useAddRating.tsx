import { API_BASE_URL } from "@/constants/applicationConstants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateRatingDto {
  bookId: number;
  value: number;
  comment?: string;
}

export const useAddRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addNewRating"],
    mutationFn: async (data: CreateRatingDto) => {
      const response = await fetch(`${API_BASE_URL}/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Nepodarilo sa pridať hodnotenie");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookDetail", data.bookId] });
    },
  });
};
