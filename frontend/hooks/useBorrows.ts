"use client";

import { useState, useEffect } from "react";
import { BorrowRecord } from "@/lib/types";
import { mockBorrowApi } from "@/lib/mockApi";
import { useAuth } from "@/components/providers/AuthContext";

export const useBorrows = () => {
	const { user } = useAuth();
	const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
	const [activeBorrows, setActiveBorrows] = useState<BorrowRecord[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadBorrows = async () => {
		if (!user) return;

		setIsLoading(true);
		setError(null);

		try {
			const userBorrows = await mockBorrowApi.getUserBorrows(user.id);
			const active = await mockBorrowApi.getActiveBorrows(user.id);
			setBorrows(userBorrows);
			setActiveBorrows(active);
		} catch (err: any) {
			setError(err.message || "Chyba pri načítaní výpožičiek");
		} finally {
			setIsLoading(false);
		}
	};

	const borrowBook = async (bookId: string) => {
		if (!user) {
			throw new Error("Musíte byť prihlásený");
		}

		setIsLoading(true);
		setError(null);

		try {
			await mockBorrowApi.borrowBook(user.id, bookId);
			await loadBorrows();
		} catch (err: any) {
			setError(err.message || "Chyba pri vypožičaní knihy");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const returnBook = async (borrowId: string) => {
		setIsLoading(true);
		setError(null);

		try {
			await mockBorrowApi.returnBook(borrowId);
			await loadBorrows();
		} catch (err: any) {
			setError(err.message || "Chyba pri vrátení knihy");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const checkHasBorrowed = async (bookId: string): Promise<boolean> => {
		if (!user) return false;
		return await mockBorrowApi.checkUserHasBorrowed(user.id, bookId);
	};

	useEffect(() => {
		if (user) {
			loadBorrows();
		}
	}, [user]);

	return {
		borrows,
		activeBorrows,
		isLoading,
		error,
		borrowBook,
		returnBook,
		checkHasBorrowed,
		refresh: loadBorrows,
	};
};
