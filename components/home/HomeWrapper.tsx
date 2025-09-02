"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import schollImage from "../../public/img/main.png";
import { Button } from "../ui/button";

const Hero: FC = () => {
  const homepageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      variants={homepageVariants}
      initial="hidden"
      animate="visible"
      className="relative z-0 container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20 xl:px-0"
    >
      <div className="flex flex-col-reverse gap-8 md:flex-row md:items-center md:gap-12">
        <div className="w-full space-y-4 md:w-3/5 md:space-y-6 lg:space-y-8">
          <h1 className="text-heading-color text-center text-4xl leading-tight font-black tracking-tighter break-words text-gray-900 sm:text-5xl md:text-left md:text-6xl lg:text-7xl xl:text-8xl dark:text-blue-50">
            SPŠT Knižnica
          </h1>

          <h2 className="prose max-w-none text-center text-lg text-gray-700 sm:text-xl md:text-left lg:text-2xl dark:text-blue-50">
            <q className="italic">
              Knihy sú jedinečne prenosné kúzlo - Stephen King
            </q>
          </h2>

          <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
            <Link href="/books" className="w-full sm:w-auto">
              <Button
                id="bookBtn"
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
                id="schollBtn"
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
              src={schollImage || "/placeholder.svg"}
              alt="Scholl homepage"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={true}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Hero;