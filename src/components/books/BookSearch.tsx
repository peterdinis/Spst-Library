import { FC, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BooksSearchProps {
  onSearch: (query: string) => void;
  value?: string;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export const BooksSearch: FC<BooksSearchProps> = ({
  onSearch,
  value = "",
  placeholder = "Hľadať knihy, autorov, ISBN...",
  className,
  debounceMs = 500,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  // Debounced search
  useEffect(() => {
    if (inputValue === value) return;

    setIsDebouncing(true);
    const timer = setTimeout(() => {
      onSearch(inputValue);
      setIsDebouncing(false);
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      setIsDebouncing(false);
    };
  }, [inputValue, onSearch, value, debounceMs]);

  const handleClear = useCallback(() => {
    setInputValue("");
    onSearch("");
  }, [onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <motion.form
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      onSubmit={handleSubmit}
      className={cn("relative", className)}
    >
      <div className="relative">
        <motion.div
          whileFocus={{ scale: 1.02 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-10 pr-10 py-6 text-base border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          
          <AnimatePresence>
            {inputValue && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-12 top-1/2 transform -translate-y-1/2"
              >
                {isDebouncing ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="h-6 w-6 p-0 hover:bg-muted/50"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-3"
          >
            Hľadať
          </Button>
        </motion.div>
      </div>

      {/* Search hint animation */}
      <AnimatePresence>
        {inputValue && !isDebouncing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1 text-sm text-muted-foreground px-1"
          >
            Stlačte Enter pre okamžité vyhľadávanie
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
};