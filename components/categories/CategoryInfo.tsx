import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { useCategoryInfo } from "@/hooks/categories/useCategoryInfo";


const CategoryInfo: FC = () => {
    const { id } = useParams()
    const { data, isLoading, isError } = useCategoryInfo(Number(id));

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <motion.div
                    className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
                />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="text-center text-red-500">
                Failed to load category details.
            </div>
        );
    }

    return (
        <motion.div
            className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                {data.name}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{data.description}</p>

            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Books</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence>
                    {data.books?.map((book) => (
                        <motion.div
                            key={book.id}
                            className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">{book.name}</h4>
                            <p className="text-gray-700 dark:text-gray-300">{book.description}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Year: {book.year} |{" "}
                                {book.isAvailable ? (
                                    <span className="text-green-600 dark:text-green-400">Available</span>
                                ) : (
                                    <span className="text-red-600 dark:text-red-400">Not Available</span>
                                )}
                            </p>
                            {book.isNew && (
                                <span className="inline-block mt-2 px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded-full">
                                    New
                                </span>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default CategoryInfo;
