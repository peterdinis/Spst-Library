import { ReactNode } from "react";
import { Navigate, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: ReactNode;
    fallback?: ReactNode;
    redirectTo?: string;
}

/**
 * ProtectedRoute component that ensures user is authenticated before rendering children
 * Shows loading state while checking auth, redirects to login if not authenticated
 */
export function ProtectedRoute({
    children,
    fallback,
    redirectTo = "/login",
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            fallback || (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        <p className="text-muted-foreground">Načítavam...</p>
                    </div>
                </div>
            )
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        // Store the current location to redirect back after login
        const currentPath = router.state.location.pathname;
        const searchParams = new URLSearchParams();
        if (currentPath !== "/") {
            searchParams.set("redirect", currentPath);
        }
        const redirectPath = searchParams.toString()
            ? `${redirectTo}?${searchParams.toString()}`
            : redirectTo;

        return <Navigate to={redirectPath} />;
    }

    // User is authenticated, render children
    return <>{children}</>;
}

export default ProtectedRoute;
