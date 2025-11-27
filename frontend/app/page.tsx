import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Footer from "@/components/shared/Footer";
import { NextPage } from "next";

const Homepage: NextPage = () => {
  return (
    <>
      <Hero />
      <Services />
      <Footer />
    </>
  )
}

export default Homepage;