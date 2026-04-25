"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
	AnimatePresence,
	motion,
	useMotionValue,
	useSpring,
	useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import {
	BookOpenText,
	LibraryBig,
	Tags,
	Users2,
	LogIn,
	ShieldCheck,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ModeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { ProfileDropdownMenu } from "@/components/layout/ProfileDropdownMenu";

type DockNavbarClientProps = {
	isLoggedIn: boolean;
	hasAdminAccess: boolean;
	name?: string | null;
	email?: string | null;
};

const BASE_SIZE = 54;
const MAX_SIZE = 74;
const SPREAD = 130;

const navItems = [
	{
		href: "/books",
		label: "Knihy",
		icon: BookOpenText,
		gradient: "from-blue-500 to-indigo-500",
	},
	{
		href: "/categories",
		label: "Kategórie",
		icon: Tags,
		gradient: "from-amber-500 to-orange-500",
	},
	{
		href: "/authors",
		label: "Autori",
		icon: Users2,
		gradient: "from-emerald-500 to-teal-500",
	},
] as const satisfies ReadonlyArray<{
	href: Route;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	gradient: string;
}>;

function useDockSize(
	ref: React.RefObject<HTMLElement | null>,
	mouseY: ReturnType<typeof useMotionValue<number>>,
) {
	const distance = useMotionValue(Infinity);

	mouseY.on("change", (y) => {
		const el = ref.current;
		if (!el) return;
		const { top, height } = el.getBoundingClientRect();
		distance.set(y - (top + height / 2));
	});

	const raw = useTransform(
		distance,
		[-SPREAD, 0, SPREAD],
		[BASE_SIZE, MAX_SIZE, BASE_SIZE],
	);
	return useSpring(raw, { stiffness:280, damping: 24, mass: 0.45 });
}

function DockTooltip({ label }: { label: string }) {
	return (
		<span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-slate-900/90 px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
			{label}
		</span>
	);
}

function DockLinkItem({
	href,
	label,
	mouseY,
	isActive,
	icon: Icon,
	gradient,
}: {
	href: Route;
	label: string;
	mouseY: ReturnType<typeof useMotionValue<number>>;
	isActive: boolean;
	icon: React.ComponentType<{ className?: string }>;
	gradient: string;
}) {
	const ref = useRef<HTMLAnchorElement>(null);
	const size = useDockSize(ref as React.RefObject<HTMLElement>, mouseY);

	return (
		<motion.div style={{ width: size, height: size }} className="relative">
			<Link
				ref={ref}
				href={href}
				aria-label={label}
				className="group relative flex h-full w-full items-center justify-center rounded-[22%] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
			>
				<DockTooltip label={label} />
				<div
					className={cn(
						"flex h-full w-full items-center justify-center rounded-[22%] bg-gradient-to-br text-white shadow-[0_8px_28px_rgba(0,0,0,0.22)] transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.28)]",
						gradient,
						isActive && "ring-2 ring-white/70 ring-offset-2 ring-offset-transparent",
					)}
				>
					<Icon className="h-[45%] w-[45%]" />
				</div>
				<span
					className={cn(
						"absolute -bottom-3 h-1.5 w-1.5 rounded-full transition-opacity",
						isActive ? "bg-white/90 opacity-100" : "bg-white/60 opacity-0",
					)}
				/>
			</Link>
		</motion.div>
	);
}

function DockControlSlot({
	label,
	mouseY,
	children,
}: {
	label: string;
	mouseY: ReturnType<typeof useMotionValue<number>>;
	children: React.ReactNode;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const size = useDockSize(ref as React.RefObject<HTMLElement>, mouseY);

	return (
		<motion.div style={{ width: size, height: size }} className="relative">
			<div
				ref={ref}
				className="group relative flex h-full w-full items-center justify-center rounded-[22%] bg-gradient-to-br from-slate-500 to-slate-700 text-white shadow-[0_8px_28px_rgba(0,0,0,0.22)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.28)]"
			>
				<DockTooltip label={label} />
				{children}
			</div>
		</motion.div>
	);
}

export default function DockNavbarClient({
	isLoggedIn,
	hasAdminAccess,
	name,
	email,
}: DockNavbarClientProps) {
	const pathname = usePathname();
	const mouseY = useMotionValue(Infinity);
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div
			className="pointer-events-none fixed right-4 top-[30%] z-50 flex -translate-y-1/2 flex-col items-end gap-2"
			onMouseMove={(e) => mouseY.set(e.clientY)}
			onMouseLeave={() => mouseY.set(Infinity)}
		>
			<button
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				className={cn(
					"pointer-events-auto flex h-11 w-11 items-center justify-center rounded-2xl",
					"border border-white/25 bg-white/25 text-foreground backdrop-blur-2xl",
					"shadow-[0_8px_30px_rgba(15,23,42,0.25)] transition-transform hover:scale-105",
					"dark:border-white/10 dark:bg-white/10",
				)}
				aria-label={isOpen ? "Zavrieť dock" : "Otvoriť dock"}
				aria-expanded={isOpen}
			>
				{isOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
			</button>

			<AnimatePresence initial={false}>
				{isOpen ? (
					<motion.nav
						initial={{ x: 24, opacity: 0, scale: 0.95 }}
						animate={{ x: 0, opacity: 1, scale: 1 }}
						exit={{ x: 24, opacity: 0, scale: 0.95 }}
						transition={{ type: "spring", stiffness: 260, damping: 24 }}
				className={cn(
					"pointer-events-auto flex flex-col items-center gap-2 rounded-[26px] px-2.5 py-3",
					"border border-white/25 bg-white/20 backdrop-blur-2xl dark:border-white/10 dark:bg-white/10",
					"shadow-[0_10px_45px_rgba(15,23,42,0.28),inset_0_1px_0_rgba(255,255,255,0.35)]",
				)}
				aria-label="Rýchla navigácia"
			>
				<motion.div
					style={{ width: BASE_SIZE, height: BASE_SIZE }}
					className="hidden items-center justify-center rounded-[22%] bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white sm:flex"
				>
					<LibraryBig className="h-[45%] w-[45%]" />
				</motion.div>

				{navItems.map((item) => (
					<DockLinkItem
						key={item.href}
						href={item.href}
						label={item.label}
						icon={item.icon}
						gradient={item.gradient}
						mouseY={mouseY}
						isActive={pathname.startsWith(item.href)}
					/>
				))}

				<div className="my-1 h-px w-9 bg-white/30" />

				<DockControlSlot label="Téma" mouseY={mouseY}>
					<ModeToggle triggerClassName="h-9 w-9 rounded-xl text-white hover:bg-white/20 dark:hover:bg-white/20" />
				</DockControlSlot>

				{isLoggedIn ? (
					<>
						<DockControlSlot label="Notifikácie" mouseY={mouseY}>
							<NotificationBell triggerClassName="h-9 w-9 rounded-xl text-white hover:bg-white/20 dark:hover:bg-white/20" />
						</DockControlSlot>
						<DockControlSlot label="Profil" mouseY={mouseY}>
							<ProfileDropdownMenu
								name={name}
								email={email}
								showAdminLink={hasAdminAccess}
								triggerClassName="h-9 rounded-xl border-white/25 bg-white/10 px-2 hover:bg-white/20 dark:border-white/15 dark:hover:bg-white/20"
							/>
						</DockControlSlot>
						{hasAdminAccess ? (
							<DockLinkItem
								href="/admin"
								label="Admin"
								icon={ShieldCheck}
								gradient="from-amber-500 to-orange-500"
								mouseY={mouseY}
								isActive={pathname.startsWith("/admin")}
							/>
						) : null}
					</>
				) : (
					<>
						<DockLinkItem
							href="/login"
							label="Prihlásiť sa"
							icon={LogIn}
							gradient="from-slate-500 to-slate-700"
							mouseY={mouseY}
							isActive={pathname.startsWith("/login")}
						/>
						<DockLinkItem
							href="/admin/login"
							label="Admin login"
							icon={ShieldCheck}
							gradient="from-amber-500 to-orange-500"
							mouseY={mouseY}
							isActive={pathname.startsWith("/admin/login")}
						/>
					</>
				)}
					</motion.nav>
				) : null}
			</AnimatePresence>
		</div>
	);
}
