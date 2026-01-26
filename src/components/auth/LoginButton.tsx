import { useAuth } from "@workos-inc/authkit-react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export function LoginButton() {
	const { signIn } = useAuth();

	return (
		<Button onClick={() => signIn()} variant="default">
			<LogIn className="mr-2 h-4 w-4" />
			Prihlásiť sa
		</Button>
	);
}
