"use client";

import { motion } from "framer-motion";
import type { FC } from "react";

const Footer: FC = () => {
  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        delay: 0.5,
      },
    },
  };

  return (
    <motion.footer
      className="dark:bg-background relative mt-6"
      variants={footerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-center md:justify-between">
          <div className="mx-auto w-full px-4 text-center md:w-6/12">
            <div className="py-1 text-sm font-semibold sm:text-base">
              <a
                href="https://www.spsbj.sk/"
                className="text-2xl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.span
                  className="inline-block"
                  whileHover={{ scale: 1.1 }}
                >
                  &copy; SPŠT Knižnica 2025
                </motion.span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
