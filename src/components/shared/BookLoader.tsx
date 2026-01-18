import { motion } from "framer-motion";

export default function BookLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="relative">
        {/* Main Book Container */}
        <motion.div
          className="relative w-32 h-40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Book Pages - Flipping Animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="absolute w-28 h-36 bg-white dark:bg-gray-700 rounded-r-lg shadow-lg border-l-4 border-indigo-500"
                style={{
                  transformOrigin: "left center",
                  zIndex: 3 - index,
                }}
                animate={{
                  rotateY: [0, -180, -180, 0],
                }}
                transition={{
                  duration: 2.4,
                  delay: index * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Page Lines */}
                <div className="p-3 space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-1 bg-gray-300 dark:bg-gray-600 rounded"
                      style={{ width: `${80 - i * 10}%` }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 1, 0] }}
                      transition={{
                        duration: 2.4,
                        delay: index * 0.3 + i * 0.05,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Book Spine */}
          <motion.div
            className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-indigo-600 to-indigo-800 rounded-l-sm shadow-md"
            animate={{
              scaleY: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Loading Text */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <motion.p
            className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-600 dark:from-indigo-400 dark:to-rose-400"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Načítavam knihy...
          </motion.p>
        </motion.div>

        {/* Floating Dots */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full"
              animate={{
                y: [0, -12, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.2,
                delay: index * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 -z-10 blur-2xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-indigo-400 via-rose-400 to-amber-400 rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}