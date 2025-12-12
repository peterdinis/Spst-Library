"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar, Loader2, Upload } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

// Schema pre validáciu
const authorSchema = z.object({
  firstName: z.string().min(1, "Meno je povinné").max(100, "Meno je príliš dlhé"),
  lastName: z.string().min(1, "Priezvisko je povinné").max(100, "Priezvisko je príliš dlhé"),
  biography: z.string().min(20, "Biografia musí mať aspoň 20 znakov").max(2000, "Biografia je príliš dlhá"),
  nationality: z.string().min(1, "Národnosť je povinná"),
  birthDate: z.date().optional().nullable(),
  deathDate: z.date().optional().nullable(),
  website: z.string().url("Neplatná URL adresa").optional().or(z.literal("")),
  email: z.string().email("Neplatná emailová adresa").optional().or(z.literal("")),
  awards: z.string().optional(),
  genres: z.array(z.string()).min(1, "Vyberte aspoň jeden žáner"),
  photoUrl: z.string().optional(),
});

type AuthorFormData = z.infer<typeof authorSchema>;

const CreateAuthorPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<AuthorFormData>({
    resolver: zodResolver(authorSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      biography: "",
      nationality: "",
      website: "",
      email: "",
      awards: "",
      genres: [],
      photoUrl: "",
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setValue("photoUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleGenre = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    
    setSelectedGenres(newGenres);
    setValue("genres", newGenres, { shouldValidate: true });
  };

  const onSubmit = async (data: AuthorFormData) => {
    setIsSubmitting(true);
    
    const toastId = toast.loading("Vytváram autora...");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Data to submit:", data);
      
      toast.success(`Autor "${data.firstName} ${data.lastName}" bol úspešne pridaný!`, {
        id: toastId,
        description: "Autor je teraz dostupný v zozname.",
      });
      
    } catch (error) {
      console.error("Error creating author:", error);
      toast.error("Nepodarilo sa vytvoriť autora", {
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
    "Biografia", "Poézia", "Dráma", "Detská", "Young Adult", "Odborná", "Horor", "Romance"
  ];

  const nationalities = [
    "Slovenská", "Česká", "Americká", "Britská", "Nemecká", "Francúzska", 
    "Španielska", "Talianska", "Ruská", "Japonská", "Čínska", "Iná"
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
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
            <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">
              Vytvoriť nového autora
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
              Vyplňte informácie o novom autorovi pre vašu knižnicu
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
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      Meno *
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Zadajte meno autora"
                      {...register("firstName")}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Priezvisko *
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Zadajte priezvisko autora"
                      {...register("lastName")}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality" className="text-sm font-medium">
                      Národnosť *
                    </Label>
                    <Controller
                      name="nationality"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={errors.nationality ? "border-red-500" : ""}>
                            <SelectValue placeholder="Vyberte národnosť" />
                          </SelectTrigger>
                          <SelectContent>
                            {nationalities.map((nationality) => (
                              <SelectItem key={nationality} value={nationality}>
                                {nationality}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.nationality && (
                      <p className="text-sm text-red-500">{errors.nationality.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="autor@example.com"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Biografia */}
              <motion.div variants={itemVariants}>
                <Label htmlFor="biography" className="text-sm font-medium">
                  Biografia *
                </Label>
                <Textarea
                  id="biography"
                  placeholder="Napíšte podrobný životopis autora..."
                  className="min-h-[150px] resize-none"
                  {...register("biography")}
                />
                {errors.biography && (
                  <p className="text-sm text-red-500">{errors.biography.message}</p>
                )}
              </motion.div>

              {/* Dátumy */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  Dátumy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Dátum narodenia
                    </Label>
                    <Controller
                      name="birthDate"
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
                              <Calendar className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Vyberte dátum</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
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
                    <Label className="text-sm font-medium">
                      Dátum úmrtia
                    </Label>
                    <Controller
                      name="deathDate"
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
                              <Calendar className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Vyberte dátum (ak aplikovateľné)</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
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
                </div>
              </motion.div>

              {/* Žánry */}
              <motion.div variants={itemVariants}>
                <Label className="text-sm font-medium mb-3 block">
                  Žánry * <span className="text-gray-500 text-xs">(vyberte aspoň jeden)</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {genres.map((genre) => (
                    <Button
                      key={genre}
                      type="button"
                      variant={selectedGenres.includes(genre) ? "default" : "outline"}
                      className={cn(
                        "justify-start",
                        selectedGenres.includes(genre) && "bg-purple-600 hover:bg-purple-700"
                      )}
                      onClick={() => toggleGenre(genre)}
                    >
                      {genre}
                    </Button>
                  ))}
                </div>
                {errors.genres && (
                  <p className="text-sm text-red-500 mt-2">{errors.genres.message}</p>
                )}
              </motion.div>

              {/* Ďalšie informácie */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  Ďalšie informácie
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium">
                      Webová stránka
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://example.com"
                      {...register("website")}
                      className={errors.website ? "border-red-500" : ""}
                    />
                    {errors.website && (
                      <p className="text-sm text-red-500">{errors.website.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="awards" className="text-sm font-medium">
                      Ocenenia a úspechy
                    </Label>
                    <Textarea
                      id="awards"
                      placeholder="Napríklad: Nobelova cena za literatúru (2020), Pulitzerova cena..."
                      className="min-h-[100px] resize-none"
                      {...register("awards")}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Fotografia autora */}
              <motion.div variants={itemVariants}>
                <Label className="text-sm font-medium">
                  Fotografia autora
                </Label>
                <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 hover:border-purple-500 transition-colors">
                  {photoPreview ? (
                    <div className="relative w-48 h-48 mx-auto">
                      <img
                        src={photoPreview}
                        alt="Náhľad fotografie"
                        className="w-full h-full object-cover rounded-full shadow-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2"
                        onClick={() => {
                          setPhotoPreview(null);
                          setValue("photoUrl", "");
                        }}
                      >
                        X
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Kliknite pre nahratie fotografie
                      </p>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="photoUrl"
                    onChange={handlePhotoChange}
                  />
                  <Label
                    htmlFor="photoUrl"
                    className="mt-4 cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    {photoPreview ? "Zmeniť fotografiu" : "Nahrať fotografiu"}
                  </Label>
                </div>
              </motion.div>

              {/* Tlačidlá */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Vytváram autora...
                    </>
                  ) : (
                    "Vytvoriť autora"
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    toast.info("Vytváranie autora bolo zrušené");
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

export default CreateAuthorPage;