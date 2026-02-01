"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FC } from "react";
import {
  BookOpen,
  Bookmark,
  Sparkles,
  Newspaper,
  FileText,
} from "lucide-react";

const services = [
  {
    title: "Moje výpožičky",
    icon: <Bookmark className="w-6 h-6 md:w-8 md:h-8" />,
    description: "Zoznam aktuálne požičaných kníh a dátumy vrátenia.",
    className: "col-span-1 row-span-1 bg-blue-500/10 dark:bg-blue-500/20",
  },
  {
    title: "Novinky v knižnici",
    icon: <Newspaper className="w-6 h-6 md:w-8 md:h-8" />,
    description: "Najnovšie knihy a doplnené tituly.",
    className: "col-span-1 row-span-1 bg-rose-500/10 dark:bg-rose-500/20",
  },
  {
    title: "Digitálne zdroje",
    icon: <FileText className="w-6 h-6 md:w-8 md:h-8" />,
    description: "PDF, prezentácie a ďalšie digitálne dokumenty.",
    className: "col-span-1 row-span-1 bg-amber-500/10 dark:bg-amber-500/20",
  },
  {
    title: "Knižničný katalóg",
    icon: <BookOpen className="w-6 h-6 md:w-8 md:h-8" />,
    description: "Vyhľadávanie kníh, autorov a žánrov.",
    className: "md:col-span-2 md:row-span-2 bg-indigo-500/10 dark:bg-indigo-500/20",
  },
  {
    title: "Odporúčané knihy",
    icon: <Sparkles className="w-6 h-6 md:w-8 md:h-8" />,
    description: "Výbery kníh pre študentov a triedy.",
    className: "md:col-span-2 md:row-span-1 bg-purple-500/10 dark:bg-purple-500/20",
  },
];

const Services: FC = () => {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
          >
            Knižničné služby
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-sm sm:text-base md:text-lg text-black/50 dark:text-white/40 mt-3 md:mt-4 max-w-xl mx-auto"
          >
            Prehľad najdôležitejších funkcií školskej knižnice.
          </motion.p>
        </div>

        {/* Bento Grid - Opravený responzívny layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 auto-rows-auto">
          {/* Prvé tri karty - vždy v jednom rade na mobile */}
          <div className="sm:col-span-2 lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-0">
            {services.slice(0, 3).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                whileHover={{ scale: 1.025 }}
                className={cn(
                  "rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm border border-black/5 dark:border-white/10 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-all duration-300",
                  "flex flex-col justify-between min-h-[120px] sm:min-h-[140px] md:min-h-[160px]",
                  item.className
                )}
              >
                <div className="text-black dark:text-white">{item.icon}</div>
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 md:mb-2 text-black dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-black/60 dark:text-white/50 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Zvyšné dve karty - responzívny layout */}
          {services.slice(3).map((item, i) => (
            <motion.div
              key={i + 3}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: (i + 3) * 0.1,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              whileHover={{ scale: 1.025 }}
              className={cn(
                "rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm border border-black/5 dark:border-white/10 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-all duration-300",
                "flex flex-col justify-between",
                item.className,
                // Responzívne classes
                i === 0 
                  ? "col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 sm:row-span-2 min-h-[140px] sm:min-h-[300px] md:min-h-[340px]" // Katalóg
                  : "col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 min-h-[120px] sm:min-h-[140px] md:min-h-[160px]" // Odporúčané
              )}
            >
              <div className="text-black dark:text-white">{item.icon}</div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 md:mb-2 text-black dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-black/60 dark:text-white/50 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;