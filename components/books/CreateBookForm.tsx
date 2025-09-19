"use client";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Header from "../shared/Header";
import { 
  Input 
} from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useCreateBook } from "@/hooks/books/useCreateBook";
import { CreateBookDto, createBookSchema } from "@/hooks/books/bookSchema";
import { useCategories } from "@/hooks/categories/useCategories";
import { useAllAuthors } from "@/hooks/authors/useAllAuthors";

const CreateBookForm: FC = () => {
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: authorsData, isLoading: authorsLoading } = useAllAuthors({ page: 1, limit: 50 });

  const { mutate: createBook, isPending } = useCreateBook();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateBookDto>({
    resolver: zodResolver(createBookSchema),
  });

  const onSubmit = (data: CreateBookDto) => {
    createBook(data, {
      onSuccess: () => reset(),
    });
  };

  if (categoriesLoading || authorsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Header text="Vytvorenie novej knihy" />

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card p-8 rounded-lg shadow-card space-y-6"
      >
        <div>
          <Label htmlFor="name">Názov knihy</Label>
          <Input id="name" placeholder="Zadajte názov" {...register("name")} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="description">Popis</Label>
          <Textarea id="description" placeholder="Popis knihy" {...register("description")} />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="year">Rok vydania</Label>
            <Input type="number" id="year" {...register("year")} />
            {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
          </div>

          <div>
            <Label htmlFor="author">Autor</Label>
            <Select {...register("authorId")}>
              <SelectTrigger>
                <SelectValue placeholder="Vyber autora" />
              </SelectTrigger>
              <SelectContent>
                {authorsData?.data.map((author) => (
                  <SelectItem key={author.id} value={author.id.toString()}>
                    {author.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.authorId && <p className="text-red-500 text-sm">{errors.authorId.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Kategória</Label>
            <Select {...register("categoryId")}>
              <SelectTrigger>
                <SelectValue placeholder="Vyber kategóriu" />
              </SelectTrigger>
              <SelectContent>
                {categoriesData?.data.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
          </div>

          <div className="flex flex-col justify-end space-y-2">
            <Checkbox {...register("isAvailable")} id="isAvailable" />
            <Label htmlFor="isAvailable">Dostupná</Label>

            <Checkbox {...register("isNew")} id="isNew" />
            <Label htmlFor="isNew">Nová kniha</Label>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin w-8 h-8" /> : "Vytvoriť knihu"}
        </Button>
      </motion.form>
    </div>
  );
};

export default CreateBookForm;