import { useAuth, useUser } from "@workos-inc/authkit-react";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings } from "lucide-react";

export function UserProfile() {
	const { user: workosUser } = useUser();
	const { signOut } = useAuth();
	const convexUser = useQuery(
		api.users.getCurrentUser,
		workosUser?.id ? { workosId: workosUser.id } : "skip",
	);

	if (!workosUser) {
		return null;
	}

	const displayName =
		convexUser?.fullName ||
		`${workosUser.firstName || ""} ${workosUser.lastName || ""}`.trim() ||
		workosUser.email;
	const initials = displayName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-10 w-10 rounded-full">
					<Avatar className="h-10 w-10">
						<AvatarImage
							src={workosUser.profilePictureUrl || convexUser?.imageUrl}
							alt={displayName}
						/>
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{displayName}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{workosUser.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<a href="/profile" className="cursor-pointer">
						<User className="mr-2 h-4 w-4" />
						<span>Profil</span>
					</a>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<a href="/settings" className="cursor-pointer">
						<Settings className="mr-2 h-4 w-4" />
						<span>Nastavenia</span>
					</a>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => signOut()}>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Odhlásiť sa</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
