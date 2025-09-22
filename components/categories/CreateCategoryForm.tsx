"use client";

import { FC } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  CreateCategoryDto,
  useCreateCategory,
} from "@/hooks/categories/useCreateCategory";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { TipTapEditor } from "../shared/TipTapEditor";
import { useRoleCheck } from "@/hooks/auth/useRoleCheck";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const CreateCategoryForm: FC = () => {
  const { toast } = useToast();
  const router = useRouter();

  const { isLoading, isUnauthorized } = useRoleCheck("TEACHER");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  });

  const { mutate, isPending } = useCreateCategory();

  const onSubmit = (data: FormValues) => {
    mutate(data as CreateCategoryDto, {
      onSuccess: () => {
        toast({ title: "Category created ✅" });
        form.reset();
      },
      onError: (err) => {
        toast({
          title: "Error",
          description: err.message || "Failed to create category",
          variant: "destructive",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <p className="text-center mt-8">
        <Loader2 className="animate-spin w-8 h-8 mx-auto" />
      </p>
    );
  }

  if (isUnauthorized) {
    router.push("/unauthorized");
  }

  return (
    <div className="mt-16">
      <h2 className="text-center text-5xl font-bold">Nová kategoria</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto mt-4 max-w-md space-y-6 p-4 rounded-lg border bg-card shadow"
        >
          {/* Category Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Science Fiction" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description with TipTap */}
          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (optional)</FormLabel>
                <FormControl>
                  <TipTapEditor
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="animate-spin w-8 h-8" />
            ) : (
              "Create Category"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCategoryForm;
