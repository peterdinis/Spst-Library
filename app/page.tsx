import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import Sections from "@/components/home/Sections";
import type { NextPage } from "next";

const Homepage: NextPage = () => {
	return (
    <>
      <Hero />
      <Features />
      <Sections />
      <Footer />
    </>
  )
};

export default Homepage;
