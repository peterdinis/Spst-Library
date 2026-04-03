"use client";

import Image from "next/image";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/trpc/client";
import { FileUpload } from "./FileUpload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BookFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function BookForm({ initialData, onSuccess }: BookFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [isbn, setIsbn] = useState(initialData?.isbn || "");
  const [availableCopies, setAvailableCopies] = useState(initialData?.availableCopies || 1);
  const [authorId, setAuthorId] = useState(initialData?.authorId || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl || "");

  const { data: authors } = trpc.authors.getAll.useQuery();
  const { data: categories } = trpc.categories.getAll.useQuery();
  const utils = trpc.useUtils();

  const createBook = trpc.books.create.useMutation({
    onSuccess: () => {
      toast.success("Kniha úspešne pridaná!");
      utils.books.getAll.invalidate();
      onSuccess?.();
      if (!initialData) resetForm();
    },
    onError: (e) => toast.error(e.message),
  });

  const updateBook = trpc.books.update.useMutation({
    onSuccess: () => {
      toast.success("Kniha úspešne upravená!");
      utils.books.getAll.invalidate();
      onSuccess?.();
    },
    onError: (e) => toast.error(e.message),
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setIsbn("");
    setAvailableCopies(1);
    setAuthorId("");
    setCategoryId("");
    setCoverUrl("");
  };

  const isEditing = !!initialData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title,
      description: description || undefined,
      isbn: isbn || undefined,
      availableCopies: Number(availableCopies),
      authorId,
      categoryId,
      coverUrl: coverUrl || undefined,
    };

    if (isEditing) {
      updateBook.mutate({ id: initialData.id, ...data });
    } else {
      createBook.mutate(data);
    }
  };

  return (
    <Card className="shadow-xl border-slate-200/50 rounded-3xl overflow-hidden">
      <CardHeader className="bg-slate-50/50">
        <CardTitle>{isEditing ? "Upraviť knihu" : "Pridať novú knihu"}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Základné informácie</label>
              <Input placeholder="Názov knihy" value={title} onChange={e => setTitle(e.target.value)} required className="rounded-xl" />
              <Textarea placeholder="Popis" value={description} onChange={e => setDescription(e.target.value)} className="rounded-xl min-h-[100px]" />
              <Input placeholder="ISBN (voliteľné)" value={isbn} onChange={e => setIsbn(e.target.value)} className="rounded-xl" />
              <Input type="number" placeholder="Počet kusov" value={availableCopies} onChange={e => setAvailableCopies(Number(e.target.value))} required className="rounded-xl" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Kategorizácia</label>
              <Select value={authorId} onValueChange={setAuthorId} required>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Vyberte autora" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {authors?.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Vyberte kategóriu" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Obálka knihy</label>
              <FileUpload onUploadComplete={setCoverUrl} defaultValue={coverUrl} />
              {coverUrl && (
                <div className="mt-2 p-2 border rounded-xl bg-slate-50 overflow-hidden">
                  <p className="text-xs text-slate-500 truncate mb-1">Nahrané: {coverUrl}</p>
                  <div className="relative h-32 w-24 mx-auto">
                    <Image
                      src={coverUrl}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg shadow-md"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4">
              <Button 
                disabled={createBook.isPending || updateBook.isPending || (!coverUrl && !isEditing)} 
                type="submit" 
                className="w-full h-12 rounded-xl text-lg font-semibold shadow-indigo-200/50 shadow-lg"
              >
                {isEditing ? "Uložiť zmeny" : "Vytvoriť knihu"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
