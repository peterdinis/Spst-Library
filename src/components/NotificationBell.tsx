"use client";

import { trpc } from "@/trpc/client";
import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { sk } from "date-fns/locale";
import { toast } from "sonner";

export function NotificationBell() {
	const { data: notifications } = trpc.notifications.getAll.useQuery();
	const utils = trpc.useUtils();

	const markAsRead = trpc.notifications.markAsRead.useMutation({
		onSuccess: () => utils.notifications.getAll.invalidate(),
	});

	const markAllAsRead = trpc.notifications.markAllAsRead.useMutation({
		onSuccess: () => utils.notifications.getAll.invalidate(),
	});

	const removeOne = trpc.notifications.remove.useMutation({
		async onMutate({ id }) {
			await utils.notifications.getAll.cancel();
			const previous = utils.notifications.getAll.getData();
			utils.notifications.getAll.setData(undefined, (old) =>
				old?.filter((n) => n.id !== id) ?? [],
			);
			return { previous };
		},
		onError: (_err, _vars, ctx) => {
			if (ctx?.previous) {
				utils.notifications.getAll.setData(undefined, ctx.previous);
			}
			toast.error("Nepodarilo sa zmazať upozornenie");
		},
		onSettled: () => utils.notifications.getAll.invalidate(),
		onSuccess: () => toast.success("Upozornenie bolo odstránené"),
	});

	const removeAll = trpc.notifications.removeAll.useMutation({
		async onMutate() {
			await utils.notifications.getAll.cancel();
			const previous = utils.notifications.getAll.getData();
			utils.notifications.getAll.setData(undefined, []);
			return { previous };
		},
		onError: (_err, _vars, ctx) => {
			if (ctx?.previous) {
				utils.notifications.getAll.setData(undefined, ctx.previous);
			}
			toast.error("Nepodarilo sa zmazať upozornenia");
		},
		onSettled: () => utils.notifications.getAll.invalidate(),
		onSuccess: () => toast.success("Všetky upozornenia boli odstránené"),
	});

	const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="group relative inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
				<Bell className="h-6 w-6 text-slate-600 transition-colors group-hover:text-violet-600 dark:text-slate-400" />
				<AnimatePresence>
					{unreadCount > 0 && (
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							exit={{ scale: 0 }}
							className="absolute -top-1 -right-1"
						>
							<Badge className="flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1 text-[10px] font-black text-white dark:border-slate-950">
								{unreadCount}
							</Badge>
						</motion.div>
					)}
				</AnimatePresence>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-[min(100vw-1.5rem,24rem)] rounded-3xl p-4 shadow-2xl border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl bg-white/90 dark:bg-slate-950/90"
			>
				<div className="flex flex-wrap items-center justify-between gap-2 mb-4 px-2">
					<h3 className="font-black text-lg tracking-tight">Upozornenia</h3>
					<div className="flex flex-wrap items-center gap-1 justify-end">
						{unreadCount > 0 && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => markAllAsRead.mutate()}
								className="text-xs font-bold text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-xl px-3"
							>
								Označiť všetko
							</Button>
						)}
						{(notifications?.length ?? 0) > 0 && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									if (
										typeof window !== "undefined" &&
										!window.confirm(
											"Naozaj chcete zmazať všetky upozornenia? Túto akciu nie je možné vrátiť späť.",
										)
									) {
										return;
									}
									removeAll.mutate();
								}}
								disabled={removeAll.isPending}
								className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl px-3"
							>
								Zmazať všetko
							</Button>
						)}
					</div>
				</div>
				<div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
					{notifications?.length === 0 ? (
						<div className="py-12 text-center text-slate-400">
							<Bell className="h-10 w-10 mx-auto mb-3 opacity-20" />
							<p className="text-sm font-medium">Žiadne nové správy</p>
						</div>
					) : (
						notifications?.map((n) => (
							<motion.div
								key={n.id}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								className={`flex gap-3 rounded-2xl border p-3 sm:p-4 transition-all ${n.isRead ? "border-transparent bg-slate-50/40 dark:bg-slate-900/30 opacity-80" : "border-violet-200/60 bg-violet-50/60 dark:border-violet-800/40 dark:bg-violet-950/25"}`}
							>
								<div
									className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.isRead ? "bg-slate-300" : "bg-violet-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"}`}
								/>
								<div className="min-w-0 flex-1 space-y-1 pr-1">
									<p
										className={`text-sm leading-relaxed ${n.isRead ? "text-slate-600 dark:text-slate-400" : "font-medium text-slate-900 dark:text-slate-100"}`}
									>
										{n.message}
									</p>
									<p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
										{n.createdAt && !isNaN(new Date(n.createdAt).getTime())
											? formatDistanceToNow(new Date(n.createdAt), {
													addSuffix: true,
													locale: sk,
												})
											: ""}
									</p>
								</div>
								<div className="flex shrink-0 flex-col gap-1">
									{!n.isRead && (
										<button
											type="button"
											title="Označiť ako prečítané"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												markAsRead.mutate({ id: n.id });
											}}
											className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:border-violet-300 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900"
										>
											<Check className="h-3.5 w-3.5" />
										</button>
									)}
									<button
										type="button"
										title="Zmazať"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											removeOne.mutate({ id: n.id });
										}}
										disabled={removeOne.isPending}
										className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:border-rose-200 hover:text-rose-600 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900"
									>
										<Trash2 className="h-3.5 w-3.5" />
									</button>
								</div>
							</motion.div>
						))
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
