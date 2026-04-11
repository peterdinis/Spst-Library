"use client";

import { trpc } from "@/trpc/client";
import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { sk } from "date-fns/locale";

export function NotificationBell() {
	const { data: notifications } = trpc.notifications.getAll.useQuery();
	const utils = trpc.useUtils();

	const markAsRead = trpc.notifications.markAsRead.useMutation({
		onSuccess: () => utils.notifications.getAll.invalidate(),
	});

	const markAllAsRead = trpc.notifications.markAllAsRead.useMutation({
		onSuccess: () => utils.notifications.getAll.invalidate(),
	});

	const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

	return (
		<DropdownMenu>
			{/* Nie vnorené <Button> — Trigger už renderuje <button> (Base UI). */}
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
				className="w-96 rounded-3xl p-4 shadow-2xl border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl bg-white/90 dark:bg-slate-950/90"
			>
				<div className="flex items-center justify-between mb-4 px-2">
					<h3 className="font-black text-lg tracking-tight">Upozornenia</h3>
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
								className={`group relative p-4 rounded-2xl transition-all border ${n.isRead ? "bg-transparent border-transparent grayscale-[0.5] opacity-60" : "bg-violet-50/50 border-violet-100/50 dark:bg-violet-900/10 dark:border-violet-800/30"}`}
							>
								<div className="flex gap-4">
									<div
										className={`h-2 w-2 rounded-full mt-2 shrink-0 ${n.isRead ? "bg-slate-300" : "bg-violet-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"}`}
									/>
									<div className="space-y-1 pr-6">
										<p
											className={`text-sm leading-relaxed ${n.isRead ? "text-slate-500" : "text-slate-900 dark:text-slate-100 font-medium"}`}
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
								</div>
								{!n.isRead && (
									<button
										onClick={() => markAsRead.mutate({ id: n.id })}
										className="absolute top-4 right-4 h-6 w-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-violet-600 hover:border-violet-300 transition-all opacity-0 group-hover:opacity-100"
									>
										<Check className="h-3 w-3" />
									</button>
								)}
							</motion.div>
						))
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
