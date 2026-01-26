import { useAuth } from "@workos-inc/authkit-react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export function RegisterButton() {
	const { signIn } = useAuth();

	return (
		<Button onClick={() => signIn()} variant="outline">
			<UserPlus className="mr-2 h-4 w-4" />
			Registrovať sa
		</Button>
	);
}
