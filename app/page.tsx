import type { NextPage } from "next";
import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import Sections from "@/components/home/Sections";

const Homepage: NextPage = () => {
	return (
		<>
			<Hero />
			<Features />
			<Sections />
			<Footer />
		</>
	);
};

export default Homepage;
