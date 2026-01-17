"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Doc } from "convex/_generated/dataModel";

interface BooksFiltersProps {
  categories: Doc<"categories">[];
  authors: Doc<"authors">[];
  selectedCategory?: string;
  selectedAuthor?: string;
  selectedStatus?: string;
  onCategoryChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

export const BooksFilters: FC<BooksFiltersProps> = ({
  categories,
  authors,
  selectedCategory,
  selectedAuthor,
  selectedStatus,
  onCategoryChange,
  onAuthorChange,
  onStatusChange,
  onClear,
}) => {
  const hasActiveFilters = selectedCategory || selectedAuthor || selectedStatus;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-4 border rounded-lg bg-card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <h3 className="font-semibold">Filtre</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-7 gap-1 text-xs"
          >
            <X className="h-3 w-3" />
            Vymazať
          </Button>
        )}
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Kategórie */}
        <div className="space-y-2">
          <Label htmlFor="category-filter">Kategória</Label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="Všetky kategórie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Všetky kategórie</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Autori */}
        <div className="space-y-2">
          <Label htmlFor="author-filter">Autor</Label>
          <Select value={selectedAuthor} onValueChange={onAuthorChange}>
            <SelectTrigger id="author-filter">
              <SelectValue placeholder="Všetci autori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Všetci autori</SelectItem>
              {authors.map((author) => (
                <SelectItem key={author._id} value={author._id}>
                  {author.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status-filter">Stav</Label>
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Všetky stavy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Všetky stavy</SelectItem>
              <SelectItem value="available">Dostupné</SelectItem>
              <SelectItem value="reserved">Rezervované</SelectItem>
              <SelectItem value="maintenance">V údržbe</SelectItem>
              <SelectItem value="lost">Stratené</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Apply Filters Button (optional) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="pt-2"
      >
        <Separator className="mb-4" />
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="gap-2"
          >
            <X className="h-3 w-3" />
            Resetovať filtre
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};