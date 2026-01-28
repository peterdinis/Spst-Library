import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function LoginButton() {
	const navigate = useNavigate();

	return (
		<Button onClick={() => navigate({ to: "/login" })} variant="default">
			<LogIn className="mr-2 h-4 w-4" />
			Prihlásiť sa
		</Button>
	);
}
