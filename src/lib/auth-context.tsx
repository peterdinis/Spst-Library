import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { toast } from "sonner";

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
	user: any | null;
	token: string | null;
	login: (email: string, password: string) => Promise<void>;
	register: (
		email: string,
		password: string,
		firstName: string,
		lastName: string,
	) => Promise<void>;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
	isLoading: boolean;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEBUG = false; // Set to true for debug logging

function debugLog(...args: any[]) {
	if (DEBUG) {
		console.log("[AuthContext]", ...args);
	}
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [retryCount, setRetryCount] = useState(0);

	const loginMutation = useMutation(api.auth.login);
	const registerMutation = useMutation(api.auth.register);
	const logoutMutation = useMutation(api.auth.logout);
	const getCurrentUserMutation = useMutation(api.auth.getCurrentUser);

	// Load token from localStorage on mount
	useEffect(() => {
		debugLog("Loading token from localStorage");
		const storedToken = localStorage.getItem("auth_token");
		if (storedToken) {
			debugLog("Found stored token:", storedToken.substring(0, 10) + "...");
			setToken(storedToken);
		} else {
			debugLog("No stored token found");
		}
		setIsLoading(false);
	}, []);

	// Save token to localStorage when it changes
	useEffect(() => {
		if (token) {
			debugLog("Saving token to localStorage");
			localStorage.setItem("auth_token", token);
		} else {
			debugLog("Removing token from localStorage");
			localStorage.removeItem("auth_token");
		}
	}, [token]);

	// Load and update current user when token changes
	useEffect(() => {
		if (!token) {
			debugLog("No token, clearing user");
			setCurrentUser(null);
			setRetryCount(0);
			return;
		}

		debugLog("Fetching current user with token");
		setIsLoading(true);

		getCurrentUserMutation({ token })
			.then((user) => {
				if (user) {
					debugLog("User loaded successfully:", user.email);
					setCurrentUser(user);
					setRetryCount(0);
				} else {
					debugLog("No user returned, clearing token");
					setCurrentUser(null);
					setToken(null);
					toast.error("Relácia vypršala", {
						description: "Prosím prihláste sa znova",
					});
				}
			})
			.catch((error) => {
				debugLog("Error loading user:", error);

				// Retry logic - max 2 retries
				if (retryCount < 2) {
					debugLog(`Retrying... (attempt ${retryCount + 1}/2)`);
					setRetryCount(retryCount + 1);
					setTimeout(
						() => {
							// Trigger re-fetch by updating a dummy state
							setToken(token);
						},
						1000 * (retryCount + 1),
					); // Exponential backoff
				} else {
					debugLog("Max retries reached, clearing token");
					setCurrentUser(null);
					setToken(null);
					setRetryCount(0);
					toast.error("Chyba pri načítaní používateľa", {
						description: "Prosím prihláste sa znova",
					});
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [token, getCurrentUserMutation]);

	const login = async (email: string, password: string) => {
		debugLog("Logging in user:", email);
		try {
			const result = await loginMutation({ email, password });
			debugLog("Login successful");
			setToken(result.token);
		} catch (error) {
			debugLog("Login failed:", error);
			throw error;
		}
	};

	const register = async (
		email: string,
		password: string,
		firstName: string,
		lastName: string,
	) => {
		debugLog("Registering user:", email);
		try {
			const result = await registerMutation({
				email,
				password,
				firstName,
				lastName,
			});
			debugLog("Registration successful");
			setToken(result.token);
		} catch (error) {
			debugLog("Registration failed:", error);
			throw error;
		}
	};

	const logout = async () => {
		debugLog("Logging out");
		try {
			if (token) {
				await logoutMutation({ token });
			}
		} catch (error) {
			debugLog("Logout error (non-critical):", error);
		} finally {
			setToken(null);
			setCurrentUser(null);
			setRetryCount(0);
		}
	};

	const refreshUser = async () => {
		if (!token) {
			debugLog("Cannot refresh user: no token");
			return;
		}

		debugLog("Manually refreshing user");
		setIsLoading(true);

		try {
			const user = await getCurrentUserMutation({ token });
			if (user) {
				debugLog("User refreshed successfully");
				setCurrentUser(user);
			} else {
				debugLog("No user returned on refresh");
				setCurrentUser(null);
				setToken(null);
			}
		} catch (error) {
			debugLog("Error refreshing user:", error);
			setCurrentUser(null);
			setToken(null);
		} finally {
			setIsLoading(false);
		}
	};

	const isAuthenticated = !!currentUser && !!token;

	return (
		<AuthContext.Provider
			value={{
				user: currentUser,
				token,
				login,
				register,
				logout,
				refreshUser,
				isLoading,
				isAuthenticated,
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

// Helper function to check if user is authenticated (can be used outside components)
export function isUserAuthenticated(): boolean {
	if (typeof window === "undefined") {
		return false; // On server, assume not authenticated
	}
	const token = localStorage.getItem("auth_token");
	return !!token;
}
