import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async (accessToken: string) => {
      const res = await fetch("/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Logout failed");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
