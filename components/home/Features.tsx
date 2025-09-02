"use client";

import { motion } from "framer-motion";
import { Home, School2 } from "lucide-react";
import type { FC } from "react";

const Features: FC = () => {
  const servicesVariant = {
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
    <div className="overflow-y-hidden">
      <div className="bg-gray-100 py-12 dark:bg-zinc-900">
        <div className="max-w-8xl container mx-auto">
          <motion.div
            tabIndex={0}
            aria-label="group of cards"
            className="flex flex-wrap justify-center gap-y-4 sm:justify-between"
            initial="hidden"
            animate="visible"
          >
            <motion.div
              tabIndex={0}
              aria-label="card 1"
              className="flex w-full flex-col items-center px-6 py-6 sm:w-1/2 md:w-1/4"
              variants={servicesVariant}
            >
              <Home className="h-7 w-7" />
              <h4 className="pt-5 text-center text-lg font-medium text-gray-800 dark:text-blue-50">
                Doma Objednáš
              </h4>
            </motion.div>

            <motion.div
              tabIndex={0}
              aria-label="card 2"
              className="flex w-full flex-col items-center px-6 py-6 sm:w-1/2 md:w-1/4"
              variants={servicesVariant}
            >
              <School2 className="h-7 w-7" />
              <h4 className="pt-5 text-center text-lg font-medium text-gray-800 dark:text-blue-50">
                V škole vyzdvihneš
              </h4>
            </motion.div>

            <motion.div
              tabIndex={0}
              aria-label="card 3"
              className="flex w-full flex-col items-center px-6 py-6 sm:w-1/2 md:w-1/4"
              variants={servicesVariant}
            >
              <span role="img" aria-label="eyes" className="text-2xl">
                👀
              </span>
              <h4 className="pt-5 text-center text-lg font-medium text-gray-800 dark:text-blue-50">
                Ľahké že?
              </h4>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Features;
