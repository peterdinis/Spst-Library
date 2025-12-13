"use client";

import { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Načítaj Hero len keď je potrebný
const Hero = dynamic(() => import("@/components/home/Hero"), {
	loading: () => (
		<div className="h-[600px] animate-pulse bg-gray-200 dark:bg-gray-800" />
	),
	ssr: true, // Načítaj na strane servera len ak je kritický
});

// Services môžeme lazy loadovať, keďže nie je hneď viditeľný
const Services = dynamic(() => import("@/components/home/Services"), {
	loading: () => (
		<div className="py-20">
			<div className="h-8 w-48 mx-auto mb-12 animate-pulse bg-gray-200 dark:bg-gray-800 rounded" />
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="h-64 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"
					/>
				))}
			</div>
		</div>
	),
	ssr: false, // Môžeme načítať na klientovi
});

// Footer je statický, môžeme ho importovať normálne
import Footer from "@/components/shared/Footer";

const Homepage: NextPage = () => {
	return (
		<>
			<Suspense
				fallback={
					<div className="h-[600px] animate-pulse bg-gray-200 dark:bg-gray-800" />
				}
			>
				<Hero />
			</Suspense>
			<Services />
			<Footer />
		</>
	);
};

export default Homepage;
