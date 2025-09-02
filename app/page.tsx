import Features from "@/components/home/Features";
import Hero from "@/components/home/HomeWrapper";
import Footer from "@/components/shared/Footer";
import { NextPage } from "next";

const Homepage: NextPage = () => {
  return (
    <>
      <Hero />
      <Features />
      <Footer />
    </>
  );
};

export default Homepage;
