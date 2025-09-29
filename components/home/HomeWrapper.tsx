"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { useEffect, useState } from "react";
import schollImage from "../../public/img/main.png";
import { Button } from "../ui/button";

const Hero: FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const homepageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  if (!mounted) return null;

  return (
    <motion.section
      data-testid="hero-container"
      variants={homepageVariants}
      initial="hidden"
      animate="visible"
      className="relative z-0 container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20 xl:px-0"
    >
      <div className="flex flex-col-reverse gap-8 md:flex-row md:items-center md:gap-12">
        <div className="w-full space-y-4 md:w-3/5 md:space-y-6 lg:space-y-8">
          <h1
            data-testid="hero-title"
            className="text-heading-color text-center text-4xl leading-tight font-black tracking-tighter break-words text-gray-900 sm:text-5xl md:text-left md:text-6xl lg:text-7xl xl:text-8xl dark:text-blue-50"
          >
            SPŠT Knižnica
          </h1>

          <h2
            data-testid="hero-quote"
            className="prose max-w-none text-center text-lg text-gray-700 sm:text-xl md:text-left lg:text-2xl dark:text-blue-50"
          >
            <q className="italic">
              Knihy sú jedinečne prenosné kúzlo – Stephen King
            </q>
          </h2>

          <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
            <Link href="/books" className="w-full sm:w-auto">
              <Button
                data-testid="hero-books-btn"
                size="lg"
                variant="default"
                className="w-full"
              >
                Zobraziť všetky knihy
              </Button>
            </Link>

            <Link
              href="https://www.spsbj.sk/"
              className="w-full sm:w-auto"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                data-testid="hero-school-btn"
                size="lg"
                variant="secondary"
                className="w-full"
              >
                Školská stránka
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="w-full md:w-2/5">
          <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-2xl sm:max-w-sm md:max-w-md lg:max-w-[500px]">
            <Image
              data-testid="hero-image"
              src={schollImage}
              alt="School homepage"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
