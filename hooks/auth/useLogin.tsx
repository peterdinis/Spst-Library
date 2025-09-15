import { API_BASE_URL } from "@/constants/applicationConstants";
import { LoginDto, Tokens } from "@/types/authTypes";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation<Tokens, Error, LoginDto>({
    mutationKey: ["loginUser"],
    mutationFn: async (dto) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }

      return res.json();
    },
  });
};
