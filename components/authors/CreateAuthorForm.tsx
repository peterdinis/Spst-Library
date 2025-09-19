"use client";

import { FC } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useCreateAuthor } from "@/hooks/authors/useCreateAuthor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { TipTapEditor } from "../shared/TipTapEditor";

const schema = z.object({
  name: z.string().min(1, "Meno je povinné"),
  bio: z.string().optional(),
  litPeriod: z.string().min(1, "Literárne obdobie je povinné"),
  authorImage: z.string().url("Musí byť platná URL adresa"),
  bornDate: z.string().min(1, "Dátum narodenia je povinný"),
  deathDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export const CreateAuthorForm: FC = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  const { mutateAsync, isPending } = useCreateAuthor();

  const onSubmit = async (values: FormValues) => {
    await mutateAsync(values);
    form.reset();
    alert("Autor bol úspešne vytvorený!");
  };

  const fieldAnim = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.25 },
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-xl p-4 sm:p-6 bg-card rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-2xl font-bold text-center">Vytvoriť autora</h2>

      {/* Name */}
      <motion.div {...fieldAnim}>
        <Label htmlFor="name">Meno</Label>
        <Input id="name" {...form.register("name")} />
        {form.formState.errors.name && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
        )}
      </motion.div>

      {/* Bio with TipTap */}
      <motion.div {...fieldAnim}>
        <Label className="font-medium">Biografia</Label>
        <Controller
          control={form.control}
          name="bio"
          render={({ field }) => (
            <TipTapEditor value={field.value || ""} onChange={field.onChange} />
          )}
        />
        {form.formState.errors.bio && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.bio.message}</p>
        )}
      </motion.div>

      {/* Remaining inputs */}
      {[
        { name: "litPeriod", label: "Literárne obdobie" },
        { name: "authorImage", label: "URL obrázka autora" },
        { name: "bornDate", label: "Dátum narodenia (RRRR-MM-DD)" },
        { name: "deathDate", label: "Dátum úmrtia (nepovinné)" },
      ].map(({ name, label }) => (
        <motion.div key={name} {...fieldAnim}>
          <Label htmlFor={name}>{label}</Label>
          <Input id={name} {...form.register(name as keyof FormValues)} />
          {form.formState.errors[name as keyof FormValues] && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors[name as keyof FormValues]?.message as string}
            </p>
          )}
        </motion.div>
      ))}

      <motion.div {...fieldAnim}>
        <Button type="submit" disabled={isPending} className="w-full flex justify-center items-center">
          {isPending ? (
            <>
              <Loader2 className="animate-spin w-5 h-5 mr-2" />
              Vytváram...
            </>
          ) : (
            "Vytvoriť autora"
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
};
