import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function RegisterButton() {
	const navigate = useNavigate();

	return (
		<Button
			onClick={() => navigate({ to: "/register" })}
			variant="outline"
		>
			<UserPlus className="mr-2 h-4 w-4" />
			Registrovať sa
		</Button>
	);
}
