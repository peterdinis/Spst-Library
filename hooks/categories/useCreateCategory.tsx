import { API_BASE_URL } from "@/constants/applicationConstants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

async function createCategory(data: CreateCategoryDto) {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Failed to create category");
  }
  return res.json();
}

export function useCreateCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}