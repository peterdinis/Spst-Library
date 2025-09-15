import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

async function createCategory(data: CreateCategoryDto) {
  const res = await fetch("/categories", {
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
      // ✅ invalidate any list queries so they refresh
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}