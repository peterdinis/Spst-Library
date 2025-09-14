"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: {
    id: number;
    name: string;
  };
  createdAt: string;
}

export interface ProfileError {
  message: string;
  statusCode: number;
}

// API function
const fetchUserProfile = async (): Promise<UserProfile> => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profile`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: ProfileError = {
      message: errorData.message || "Failed to fetch profile",
      statusCode: response.status,
    };
    throw error;
  }

  return response.json();
};

// Query key factory
export const profileQueryKeys = {
  all: ["profile"] as const,
  user: () => [...profileQueryKeys.all, "user"] as const,
};

// Hook
export const useProfile = (
  options?: Omit<
    UseQueryOptions<UserProfile, ProfileError, UserProfile, string[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error?.statusCode === 401 || error?.statusCode === 403) {
        return false;
      }
      return failureCount < 3;
    },
    ...options,
  });
};

// Alternative hook with error handling
export const useProfileWithAuth = () => {
  const query = useProfile({
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    isAuthenticated: !query.error || query.data !== undefined,
    isAuthError:
      query.error?.statusCode === 401 || query.error?.statusCode === 403,
  };
};

export const useAuthenticatedProfile = () => {
  const query = useProfile({
    retry: (failureCount, error) => {
      if (error?.statusCode === 401) return false;
      return failureCount < 2;
    },
  });

  if (query.isLoading) {
    return { ...query, user: null };
  }

  if (query.error?.statusCode === 401) {
    throw new Error("User not authenticated");
  }

  return {
    ...query,
    user: query.data,
  };
};
