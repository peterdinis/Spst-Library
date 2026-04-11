import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function PaginationControls({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationControlsProps) {
	if (totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-center space-x-2 p-4">
			<Button
				variant="outline"
				size="icon"
				className="h-8 w-8 rounded-lg"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage <= 1}
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>

			<div className="flex items-center justify-center min-w-[5rem] text-sm font-medium text-muted-foreground">
				Strana {currentPage} z {totalPages}
			</div>

			<Button
				variant="outline"
				size="icon"
				className="h-8 w-8 rounded-lg"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage >= totalPages}
			>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
}
