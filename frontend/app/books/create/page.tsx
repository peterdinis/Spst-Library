"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Loader2, Upload } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// Schema pre validáciu
const bookSchema = z.object({
  title: z.string().min(1, "Názov je povinný").max(200, "Názov je príliš dlhý"),
  author: z.string().min(1, "Autor je povinný"),
  isbn: z.string().min(10, "ISBN musí mať aspoň 10 znakov").max(13, "ISBN môže mať maximálne 13 znakov"),
  description: z.string().min(10, "Popis musí mať aspoň 10 znakov").max(1000, "Popis je príliš dlhý"),
  genre: z.string().min(1, "Žáner je povinný"),
  pages: z.coerce.number().int().positive("Počet strán musí byť kladné číslo").optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  publishedDate: z.date().optional().nullable(),
  publisher: z.string().optional(),
  language: z.string().optional(),
  isAvailable: z.boolean().default(true),
  price: z.coerce.number().positive("Cena musí byť kladné číslo").optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  coverImage: z.string().optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

const CreateBookPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    mode: "onChange",
    defaultValues: {
      isAvailable: true,
      title: "",
      author: "",
      isbn: "",
      description: "",
      genre: "",
      publisher: "",
      language: "",
      coverImage: "",
    },
  });

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
        setValue("coverImage", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: BookFormData) => {
    setIsSubmitting(true);
    
    const toastId = toast.loading("Vytváram knihu...");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Data to submit:", data);
      
      toast.success(`Kniha "${data.title}" bola úspešne pridaná do knižnice!`, {
        id: toastId,
        description: "Kniha je teraz dostupná v zozname.",
      });
      
    } catch (error) {
      console.error("Error creating book:", error);
      toast.error("Nepodarilo sa vytvoriť knihu", {
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

  const genres = [
    "Román", "Fantasy", "Sci-Fi", "Detektívka", "Triler", "Historická", 
    "Biografia", "Poézia", "Dráma", "Detská", "Young Adult", "Odborná", "Iné"
  ];

  const languages = ["Slovenský", "Český", "Anglický", "Nemecký", "Francúzsky", "Španielsky", "Iný"];

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="border-2 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
            <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">
              Vytvoriť novú knihu
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
              Vyplňte informácie o novej knihe pre vašu knižnicu
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
                    <Label htmlFor="title" className="text-sm font-medium">
                      Názov knihy *
                    </Label>
                    <Input
                      id="title"
                      placeholder="Zadajte názov knihy"
                      {...register("title")}
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-sm font-medium">
                      Autor *
                    </Label>
                    <Input
                      id="author"
                      placeholder="Meno autora"
                      {...register("author")}
                      className={errors.author ? "border-red-500" : ""}
                    />
                    {errors.author && (
                      <p className="text-sm text-red-500">{errors.author.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="isbn" className="text-sm font-medium">
                      ISBN *
                    </Label>
                    <Input
                      id="isbn"
                      placeholder="978-3-16-148410-0"
                      {...register("isbn")}
                      className={errors.isbn ? "border-red-500" : ""}
                    />
                    {errors.isbn && (
                      <p className="text-sm text-red-500">{errors.isbn.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="genre" className="text-sm font-medium">
                      Žáner *
                    </Label>
                    <Controller
                      name="genre"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={errors.genre ? "border-red-500" : ""}>
                            <SelectValue placeholder="Vyberte žáner" />
                          </SelectTrigger>
                          <SelectContent>
                            {genres.map((genre) => (
                              <SelectItem key={genre} value={genre}>
                                {genre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.genre && (
                      <p className="text-sm text-red-500">{errors.genre.message}</p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Popis */}
              <motion.div variants={itemVariants}>
                <Label htmlFor="description" className="text-sm font-medium">
                  Popis knihy *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Napíšte podrobný popis knihy..."
                  className="min-h-[120px] resize-none"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </motion.div>

              {/* Detaily */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  Ďalšie detaily
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pages" className="text-sm font-medium">
                      Počet strán
                    </Label>
                    <Input
                      id="pages"
                      type="number"
                      placeholder="Napríklad: 320"
                      {...register("pages")}
                    />
                    {errors.pages && (
                      <p className="text-sm text-red-500">{errors.pages.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-sm font-medium">
                      Jazyk
                    </Label>
                    <Controller
                      name="language"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Vyberte jazyk" />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem key={lang} value={lang}>
                                {lang}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publisher" className="text-sm font-medium">
                      Vydavateľstvo
                    </Label>
                    <Input
                      id="publisher"
                      placeholder="Názov vydavateľstva"
                      {...register("publisher")}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Dátum vydania a Cena */}
              <motion.div variants={itemVariants}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Dátum vydania
                    </Label>
                    <Controller
                      name="publishedDate"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Vyberte dátum</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium">
                      Cena (€)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register("price")}
                    />
                    {errors.price && (
                      <p className="text-sm text-red-500">{errors.price.message}</p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Obal knihy */}
              <motion.div variants={itemVariants}>
                <Label className="text-sm font-medium">
                  Obal knihy
                </Label>
                <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 hover:border-blue-500 transition-colors">
                  {coverPreview ? (
                    <div className="relative w-48 h-64 mx-auto">
                      <img
                        src={coverPreview}
                        alt="Náhľad obalu"
                        className="w-full h-full object-cover rounded-lg shadow-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2"
                        onClick={() => {
                          setCoverPreview(null);
                          setValue("coverImage", "");
                        }}
                      >
                        X
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Kliknite pre nahranie obrázka
                      </p>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="coverImage"
                    onChange={handleCoverImageChange}
                  />
                  <Label
                    htmlFor="coverImage"
                    className="mt-4 cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {coverPreview ? "Zmeniť obrázok" : "Nahrať obrázok"}
                  </Label>
                </div>
              </motion.div>

              {/* Dostupnosť */}
              <motion.div variants={itemVariants} className="flex items-center space-x-2">
                <Controller
                  name="isAvailable"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isAvailable"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label
                  htmlFor="isAvailable"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Kniha je dostupná
                </Label>
              </motion.div>

              {/* Tlačidlá */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Vytváram knihu...
                    </>
                  ) : (
                    "Vytvoriť knihu"
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    toast.info("Vytváranie knihy bolo zrušené");
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

export default CreateBookPage;