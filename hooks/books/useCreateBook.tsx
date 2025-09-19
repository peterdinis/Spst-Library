"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { createBookSchema } from "./bookSchema";
import { useToast } from "../useToast";
import { API_BASE_URL } from "@/constants/applicationConstants";

// Infer type from Zod schema
type CreateBookInput = z.infer<typeof createBookSchema>;

interface UseCreateBookOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useCreateBook = ({ onSuccess, onError }: UseCreateBookOptions = {}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<CreateBookInput, Error, CreateBookInput>({
    mutationFn: async (book: CreateBookInput) => {
      const res = await fetch(`${API_BASE_URL}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || "Failed to create book");
      }

      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast({ title: `Book "${data.name}" created!`, duration: 2000, className: "bg-green-800 text-white font-bold text-base" });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      onError?.(error);
    },
  });

  return mutation;
};
