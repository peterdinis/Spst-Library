'use client';

import React, { useState } from "react";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthorFormProps {
  initialData?: { id: string; name: string; bio?: string | null };
  onSuccess?: () => void;
}

export function AuthorForm({ initialData, onSuccess }: AuthorFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [bio, setBio] = useState(initialData?.bio || "");
  const utils = trpc.useUtils();

  const createAuthor = trpc.authors.create.useMutation({
    onSuccess: () => {
      toast.success("Autor úspešne vytvorený!");
      setName("");
      setBio("");
      utils.authors.getAll.invalidate();
      onSuccess?.();
    },
    onError: (e) => toast.error(e.message),
  });

  const updateAuthor = trpc.authors.update.useMutation({
    onSuccess: () => {
      toast.success("Autor úspešne upravený!");
      utils.authors.getAll.invalidate();
      onSuccess?.();
    },
    onError: (e) => toast.error(e.message),
  });

  const isEditing = !!initialData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateAuthor.mutate({ id: initialData.id, name, bio: bio || undefined });
    } else {
      createAuthor.mutate({ name, bio: bio || undefined });
    }
  };

  return (
    <Card className="shadow-xl border-slate-200/50 rounded-3xl overflow-hidden">
      <CardHeader className="bg-slate-50/50">
        <CardTitle>{isEditing ? "Upraviť autora" : "Pridať nového autora"}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            placeholder="Meno autora" 
            value={name} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} 
            required 
            className="rounded-xl"
          />
          <Textarea 
            placeholder="Životopis (voliteľné)" 
            value={bio || ""} 
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
            className="rounded-xl min-h-[100px]"
          />
          <Button 
            disabled={createAuthor.isPending || updateAuthor.isPending} 
            type="submit" 
            className="w-full rounded-xl"
          >
            {isEditing ? "Uložiť zmeny" : "Vytvoriť autora"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
