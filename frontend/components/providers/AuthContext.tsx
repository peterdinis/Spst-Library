"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import {
	User,
	AuthContextType,
	LoginFormData,
	RegisterFormData,
} from "@/lib/types";
import { mockAuthApi, initializeMockData } from "@/lib/mockApi";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Initialize mock data on mount
		initializeMockData();

		// Check for existing user session
		const currentUser = mockAuthApi.getCurrentUser();
		if (currentUser) {
			setUser(currentUser);
		}
		setIsLoading(false);
	}, []);

	const login = async (email: string, password: string) => {
		try {
			const loggedInUser = await mockAuthApi.login({ email, password });
			setUser(loggedInUser);
		} catch (error) {
			throw error;
		}
	};

	const register = async (
		email: string,
		password: string,
		fullName: string,
	) => {
		try {
			const newUser = await mockAuthApi.register({
				email,
				password,
				fullName,
				confirmPassword: password,
			});
			setUser(newUser);
		} catch (error) {
			throw error;
		}
	};

	const logout = () => {
		mockAuthApi.logout();
		setUser(null);
	};

	const updateProfile = async (data: Partial<User>) => {
		if (!user) throw new Error("Nie ste prihlásený");

		try {
			const updatedUser = await mockAuthApi.updateProfile(user.id, data);
			setUser(updatedUser);
		} catch (error) {
			throw error;
		}
	};

	const value: AuthContextType = {
		user,
		isAuthenticated: !!user,
		isAdmin: user?.role === "admin",
		login,
		register,
		logout,
		updateProfile,
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		);
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
