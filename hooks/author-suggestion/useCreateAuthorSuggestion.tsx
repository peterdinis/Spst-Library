import { API_BASE_URL } from "@/constants/applicationConstants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateAuthorSuggestionInput {
  name: string;
  bio?: string;
  litPeriod: string;
  authorImage?: string;
  bornDate: string;
  deathDate?: string;
  suggestedByName?: string;
}

export function useCreateAuthorSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAuthorSuggestionInput) => {
      const res = await fetch(`${API_BASE_URL}/author-suggestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Nepodarilo sa odoslať návrh");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["author-suggestions"] });
    },
  });
}
