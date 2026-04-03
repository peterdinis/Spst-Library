"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10 animate-pulse" />
          <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-6 space-y-3 flex flex-col items-center"
      >
        <h2 className="text-2xl font-extrabold tracking-widest text-primary uppercase">
          Načítavam knižnicu...
        </h2>
        <div className="flex gap-1.5 justify-center">
          <motion.div
            className="w-2.5 h-2.5 bg-primary rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2.5 h-2.5 bg-primary rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
          />
          <motion.div
            className="w-2.5 h-2.5 bg-primary rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
