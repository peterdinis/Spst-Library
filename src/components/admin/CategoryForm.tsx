'use client';

import React, { useState } from "react";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CategoryFormProps {
  initialData?: { id: string; name: string };
  onSuccess?: () => void;
}

export function CategoryForm({ initialData, onSuccess }: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const utils = trpc.useUtils();

  const createCategory = trpc.categories.create.useMutation({
    onSuccess: () => {
      toast.success("Kategória vytvorená!");
      setName("");
      utils.categories.getAll.invalidate();
      onSuccess?.();
    },
    onError: (e) => toast.error(e.message),
  });

  const updateCategory = trpc.categories.update.useMutation({
    onSuccess: () => {
      toast.success("Kategória upravená!");
      utils.categories.getAll.invalidate();
      onSuccess?.();
    },
    onError: (e) => toast.error(e.message),
  });

  const isEditing = !!initialData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateCategory.mutate({ id: initialData.id, name });
    } else {
      createCategory.mutate({ name });
    }
  };

  return (
    <Card className="shadow-lg border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50">
        <CardTitle className="text-xl">{isEditing ? "Upraviť kategóriu" : "Nová kategória"}</CardTitle>
        <CardDescription>Názov žánru alebo tematického okruhu.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            placeholder="Názov kategórie" 
            value={name} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} 
            required 
            className="rounded-xl"
          />
          <Button 
            disabled={createCategory.isPending || updateCategory.isPending} 
            type="submit" 
            className="w-full rounded-xl h-11 font-semibold"
          >
            {isEditing ? "Uložiť zmeny" : "Vytvoriť kategóriu"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
