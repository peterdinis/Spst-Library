import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import type { NextPage } from "next";

const Homepage: NextPage = () => {
	return (
    <>
      <Hero />
      <Features />
    </>
  )
};

export default Homepage;
