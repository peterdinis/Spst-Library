"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// Schema pre validáciu
const categorySchema = z.object({
  name: z.string().min(1, "Názov kategórie je povinný").max(100, "Názov je príliš dlhý"),
  slug: z.string().min(1, "URL slug je povinný").max(100, "Slug je príliš dlhý").regex(/^[a-z0-9-]+$/, "Slug môže obsahovať iba malé písmená, čísla a pomlčky"),
  description: z.string().min(10, "Popis musí mať aspoň 10 znakov").max(500, "Popis je príliš dlhý"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Neplatná farba (použite hex formát)"),
  icon: z.string().optional(),
  parentCategory: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0, "Poradie musí byť nezáporné číslo").optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  metaTitle: z.string().max(60, "Meta title je príliš dlhý").optional(),
  metaDescription: z.string().max(160, "Meta description je príliš dlhá").optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const CreateCategoryPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
    defaultValues: {
      isActive: true,
      isFeatured: false,
      name: "",
      slug: "",
      description: "",
      color: "#3B82F6",
      icon: "",
      parentCategory: "",
      metaTitle: "",
      metaDescription: "",
    },
  });

  const watchedColor = watch("color");
  const watchedName = watch("name");

  // Automaticky generuj slug z názvu
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Odstráň diakritiku
      .replace(/[^a-z0-9]+/g, "-") // Nahraď špeciálne znaky pomlčkami
      .replace(/^-+|-+$/g, ""); // Odstráň pomlčky na začiatku a konci
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name);
    setValue("slug", generateSlug(name));
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
        setValue("icon", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    
    const toastId = toast.loading("Vytváram kategóriu...");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Data to submit:", data);
      
      toast.success(`Kategória "${data.name}" bola úspešne vytvorená!`, {
        id: toastId,
        description: "Kategória je teraz dostupná v zozname.",
      });
      
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Nepodarilo sa vytvoriť kategóriu", {
        id: toastId,
        description: "Skúste to prosím znova.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = () => {
    const errorMessages = Object.values(errors).map(error => error?.message).filter(Boolean);
    
    if (errorMessages.length > 0) {
      toast.error("Formulár obsahuje chyby", {
        description: errorMessages.slice(0, 3).join(", ") + (errorMessages.length > 3 ? "..." : ""),
      });
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const predefinedColors = [
    "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", 
    "#8B5CF6", "#EC4899", "#14B8A6", "#F97316", "#84CC16"
  ];

  const parentCategories = [
    "Beletria", "Odborná literatúra", "Detská literatúra", "Komiksy", "Časopisy"
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="border-2 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
            <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">
              Vytvoriť novú kategóriu
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
              Vyplňte informácie o novej kategórii pre vašu knižnicu
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <motion.form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Základné informácie */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  Základné informácie
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Názov kategórie *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Zadajte názov kategórie"
                      {...register("name")}
                      onChange={handleNameChange}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-sm font-medium">
                      URL Slug *
                    </Label>
                    <Input
                      id="slug"
                      placeholder="url-priatelsky-nazov"
                      {...register("slug")}
                      className={errors.slug ? "border-red-500" : ""}
                    />
                    {errors.slug && (
                      <p className="text-sm text-red-500">{errors.slug.message}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Automaticky generované z názvu
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Popis kategórie *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Napíšte stručný popis kategórie..."
                      className="min-h-[100px] resize-none"
                      {...register("description")}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">{errors.description.message}</p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Vizuálne nastavenia */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  Vizuálne nastavenia
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Farba kategórie *
                    </Label>
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-md"
                        style={{ backgroundColor: watchedColor }}
                      />
                      <div className="flex-1 space-y-2">
                        <Input
                          type="text"
                          placeholder="#3B82F6"
                          {...register("color")}
                          className={cn("font-mono", errors.color ? "border-red-500" : "")}
                        />
                        <div className="flex gap-2 flex-wrap">
                          {predefinedColors.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={cn(
                                "w-8 h-8 rounded-md border-2 transition-transform hover:scale-110",
                                watchedColor === color ? "border-gray-900 dark:border-white scale-110" : "border-gray-300"
                              )}
                              style={{ backgroundColor: color }}
                              onClick={() => setValue("color", color, { shouldValidate: true })}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {errors.color && (
                      <p className="text-sm text-red-500">{errors.color.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Ikona kategórie
                    </Label>
                    <div className="flex items-center gap-4">
                      {iconPreview ? (
                        <div className="relative w-16 h-16">
                          <img
                            src={iconPreview}
                            alt="Náhľad ikony"
                            className="w-full h-full object-contain rounded-lg border-2 border-gray-300"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0"
                            onClick={() => {
                              setIconPreview(null);
                              setValue("icon", "");
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <Palette className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="icon"
                          onChange={handleIconChange}
                        />
                        <Label
                          htmlFor="icon"
                          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                          {iconPreview ? "Zmeniť ikonu" : "Nahrať ikonu"}
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">
                          Odporúčaná veľkosť: 64x64px
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Organizácia */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  Organizácia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="parentCategory" className="text-sm font-medium">
                      Nadradená kategória
                    </Label>
                    <Controller
                      name="parentCategory"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Žiadna (hlavná kategória)</option>
                          {parentCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sortOrder" className="text-sm font-medium">
                      Poradie zobrazovania
                    </Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      placeholder="0"
                      {...register("sortOrder")}
                    />
                    {errors.sortOrder && (
                      <p className="text-sm text-red-500">{errors.sortOrder.message}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Nižšie číslo = vyššia pozícia
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* SEO nastavenia */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  SEO nastavenia
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle" className="text-sm font-medium">
                      Meta Title
                    </Label>
                    <Input
                      id="metaTitle"
                      placeholder="SEO optimalizovaný názov (max 60 znakov)"
                      {...register("metaTitle")}
                      className={errors.metaTitle ? "border-red-500" : ""}
                    />
                    {errors.metaTitle && (
                      <p className="text-sm text-red-500">{errors.metaTitle.message}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {watch("metaTitle")?.length || 0}/60 znakov
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription" className="text-sm font-medium">
                      Meta Description
                    </Label>
                    <Textarea
                      id="metaDescription"
                      placeholder="Stručný popis pre vyhľadávače (max 160 znakov)"
                      className="min-h-[80px] resize-none"
                      {...register("metaDescription")}
                    />
                    {errors.metaDescription && (
                      <p className="text-sm text-red-500">{errors.metaDescription.message}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {watch("metaDescription")?.length || 0}/160 znakov
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Nastavenia viditeľnosti */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  Nastavenia viditeľnosti
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="isActive"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label
                      htmlFor="isActive"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Kategória je aktívna
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Controller
                      name="isFeatured"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="isFeatured"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label
                      htmlFor="isFeatured"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Zvýraznená kategória (zobrazí sa na hlavnej stránke)
                    </Label>
                  </div>
                </div>
              </motion.div>

              {/* Preview kategórie */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  Náhľad kategórie
                </h3>
                <div className="p-6 border-2 border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-lg flex items-center justify-center shadow-md"
                      style={{ backgroundColor: watchedColor }}
                    >
                      {iconPreview ? (
                        <img src={iconPreview} alt="Icon" className="w-10 h-10 object-contain" />
                      ) : (
                        <Palette className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                        {watchedName || "Názov kategórie"}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {watch("description") || "Popis kategórie sa zobrazí tu..."}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tlačidlá */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Vytváram kategóriu...
                    </>
                  ) : (
                    "Vytvoriť kategóriu"
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    toast.info("Vytváranie kategórie bolo zrušené");
                  }}
                  className="flex-1"
                >
                  Zrušiť
                </Button>
              </motion.div>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateCategoryPage;