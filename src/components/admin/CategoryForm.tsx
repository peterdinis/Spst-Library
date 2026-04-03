'use client';

import React, { useState } from "react";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card className="shadow-xl border-slate-200/50 rounded-3xl overflow-hidden">
      <CardHeader className="bg-slate-50/50">
        <CardTitle>{isEditing ? "Upraviť kategóriu" : "Pridať novú kategóriu"}</CardTitle>
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
            className="w-full rounded-xl"
          >
            {isEditing ? "Uložiť zmeny" : "Vytvoriť kategóriu"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
