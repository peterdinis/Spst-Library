"use client";

import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Header from "../shared/Header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useCreateBook } from "@/hooks/books/useCreateBook";
import { CreateBookDto, createBookSchema } from "@/hooks/books/bookSchema";
import { useCategories } from "@/hooks/categories/useCategories";
import { useAllAuthors } from "@/hooks/authors/useAllAuthors";
import { useRoleCheck } from "@/hooks/auth/useRoleCheck";
import { useRouter } from "next/navigation";

const CreateBookForm: FC = () => {
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();
  const { data: authorsData, isLoading: authorsLoading } = useAllAuthors({
    page: 1,
    limit: 50,
  });

  const { mutate: createBook, isPending } = useCreateBook();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBookDto>({
    resolver: zodResolver(createBookSchema),
  });

  const onSubmit = (data: CreateBookDto) => {
    createBook(data, { onSuccess: () => reset() });
  };

  const router = useRouter();
  const { isUnauthorized } = useRoleCheck("TEACHER");

  useEffect(() => {
    if (!isUnauthorized) {
      router.push("/unauthorized");
    }
  }, [isUnauthorized, router]);

  if (categoriesLoading || authorsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Header text="Vytvorenie novej knihy" />

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card p-8 rounded-xl shadow-lg space-y-8"
      >
        {/* Názov a popis */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Názov knihy</Label>
            <Input
              id="name"
              placeholder="Zadajte názov knihy"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Popis</Label>
            <Textarea
              id="description"
              placeholder="Stručný popis knihy"
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        {/* Rok a Autor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="year">Rok vydania</Label>
            <Input
              type="number"
              id="year"
              placeholder="YYYY"
              {...register("year")}
            />
            {errors.year && (
              <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
            )}
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
            {errors.authorId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.authorId.message}
              </p>
            )}
          </div>
        </div>

        {/* Kategória a Stav */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
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
            {errors.categoryId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox {...register("isAvailable")} id="isAvailable" />
              <Label htmlFor="isAvailable" className="mb-0">
                Dostupná
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("isNew")} id="isNew" />
              <Label htmlFor="isNew" className="mb-0">
                Nová kniha
              </Label>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full flex justify-center items-center"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="animate-spin w-6 h-6 mr-2" />
          ) : (
            "Vytvoriť knihu"
          )}
        </Button>
      </motion.form>
    </div>
  );
};

export default CreateBookForm;
