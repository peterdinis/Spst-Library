import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

interface User {
	_id: Id<"users">;
	email: string;
	firstName: string;
	lastName: string;
	fullName: string;
	roles: string[];
	imageUrl?: string;
}

interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (email: string, password: string) => Promise<void>;
	register: (
		email: string,
		password: string,
		firstName: string,
		lastName: string,
	) => Promise<void>;
	logout: () => Promise<void>;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const loginMutation = useMutation(api.auth.login);
	const registerMutation = useMutation(api.auth.register);
	const logoutMutation = useMutation(api.auth.logout);
	const getCurrentUserMutation = useMutation(api.auth.getCurrentUser);
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	// Load token from localStorage on mount
	useEffect(() => {
		const storedToken = localStorage.getItem("auth_token");
		if (storedToken) {
			setToken(storedToken);
		}
		setIsLoading(false);
	}, []);

	// Save token to localStorage when it changes
	useEffect(() => {
		if (token) {
			localStorage.setItem("auth_token", token);
		} else {
			localStorage.removeItem("auth_token");
		}
	}, [token]);

	// Load and update current user when token changes
	useEffect(() => {
		if (token) {
			getCurrentUserMutation({ token })
				.then((user) => {
					setCurrentUser(user);
				})
				.catch(() => {
					setCurrentUser(null);
					setToken(null); // Clear invalid token
				});
		} else {
			setCurrentUser(null);
		}
	}, [token, getCurrentUserMutation]);

	const login = async (email: string, password: string) => {
		const result = await loginMutation({ email, password });
		setToken(result.token);
	};

	const register = async (
		email: string,
		password: string,
		firstName: string,
		lastName: string,
	) => {
		const result = await registerMutation({
			email,
			password,
			firstName,
			lastName,
		});
		setToken(result.token);
	};

	const logout = async () => {
		if (token) {
			await logoutMutation({ token });
		}
		setToken(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user: currentUser as User | null,
				token,
				login,
				register,
				logout,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
