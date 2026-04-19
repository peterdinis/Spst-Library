"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { VariantProps } from "class-variance-authority";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";

function Button({
	className,
	variant = "default",
	size = "default",
	...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return (
			<button
				data-slot="button"
				className={cn(buttonVariants({ variant, size, className }))}
				aria-hidden="true"
				style={{ visibility: "hidden" }}
			/>
		);
	}

	return (
		<ButtonPrimitive
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
