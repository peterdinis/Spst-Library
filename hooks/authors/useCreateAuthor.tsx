import { API_BASE_URL } from "@/constants/applicationConstants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateAuthorDto {
  name: string;
  bio?: string;
  litPeriod: string;
  authorImage: string;
  bornDate: string;
  deathDate?: string;
}

export function useCreateAuthor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAuthorDto) => {
      const res = await fetch(`${API_BASE_URL}/authors?`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create author");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
  });
}
