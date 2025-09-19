"use client";

import { useState, useMemo, FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Calendar, Award, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useAllAuthors } from "@/hooks/authors/useAllAuthors";
import { Author } from "@/types/authorTypes";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import { useCreateAuthorSuggestion } from "@/hooks/author-suggestion/useCreateAuthorSuggestion";
import { useForm } from "react-hook-form";
import { FormValues, schema } from "./authorSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/useToast";
import { useDebounce } from "@/hooks/shared/useDebounce";

interface AuthorWithCounts extends Author {
  bookCount: number;
  availableBooks: number;
  genres: string[];
  popularWorks: string[];
  awards: string[];
}

const AuthorsWrapper: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);
  const { data, isLoading, error } = useAllAuthors({
    search: debouncedSearch,
    page: 1,
    limit: 50,
  });

  const { toast } = useToast();
  const [suggestName, setSuggestName] = useState("");
  const [suggestNote, setSuggestNote] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const { mutate: createSuggestion, isPending } = useCreateAuthorSuggestion();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const authors: Author[] = data?.data || [];

  const authorsWithCounts: AuthorWithCounts[] = useMemo(() => {
    return authors.map((author) => ({
      ...author,
      bookCount: author.books.length,
      availableBooks: author.books.filter((b) => b.isAvailable).length,
      genres: author.litPeriod ? [author.litPeriod] : [],
      popularWorks: author.books.slice(0, 3).map((b) => b.name),
      awards: [],
    }));
  }, [authors]);

  const filteredAuthors = useMemo(() => {
    return authorsWithCounts.filter(
      (author) =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        author.genres.some((genre) =>
          genre.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );
  }, [authorsWithCounts, searchTerm]);

  const totalBooks = authorsWithCounts.reduce(
    (sum, author) => sum + author.bookCount,
    0,
  );
  const totalAvailable = authorsWithCounts.reduce(
    (sum, author) => sum + author.availableBooks,
    0,
  );

  const onSubmit = (values: FormValues) => {
    createSuggestion(values, {
      onSuccess: () => {
        reset();
        toast({
          title: "Nový typ na spisovateľa/ku bol pridaný",
          duration: 2000,
          className: "bg-green-800 text-white font-bold text-base",
        });
        setOpenDialog(false);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Chyba pri načítavaní autorov: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Zbierka autorov
          </h1>
          <p className="text-muted-foreground mb-6">
            Objavte skvelé mysle stojace za vašimi obľúbenými knihami
          </p>

          <div className="bg-card p-6 rounded-lg shadow-card mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {authors.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Zobrazení autori
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-8 w-8 text-success" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {totalBooks}
                </div>
                <div className="text-sm text-muted-foreground">Spolu diel</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {totalAvailable}
                </div>
                <div className="text-sm text-muted-foreground">
                  Dostupné teraz
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Search className="h-8 w-8 text-foreground" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {
                    Array.from(
                      new Set(authorsWithCounts.flatMap((a) => a.genres)),
                    ).length
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  Pokryté žánre
                </div>
              </div>
            </div>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Hľadajte autorov alebo žánre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuthors.map((author, index) => (
            <Card
              key={author.id}
              className="hover-lift shadow-card group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-smooth">
                      {author.name}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                      Narodený {author.bornDate} •{" "}
                      {author.deathDate ? `Zomrel ${author.deathDate}` : "Žije"}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary"
                  >
                    {author.availableBooks}/{author.bookCount} dostupných
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {author.bio}
                </p>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-foreground">
                    Žánre:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {author.genres.map((genre, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-foreground">
                    Populárne diela:
                  </div>
                  <div className="space-y-1">
                    {author.popularWorks.map((work, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-muted-foreground flex items-center"
                      >
                        <BookOpen className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{work}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Link href={`/authors/${author.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Zobraziť detail o autorovi
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAuthors.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-muted-foreground text-lg">
              Nenašli sa žiadni autori zodpovedajúci vášmu hľadaniu.
            </p>
            <p className="text-muted-foreground">Skúste iný hľadaný výraz.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="bg-gradient-secondary p-8 rounded-lg text-black dark:text-white">
            <h2 className="text-2xl font-bold mb-2">Navrhnite nového autora</h2>
            <p className="mb-4 opacity-90">
              Nevidíte svojho obľúbeného autora? Pošlite nám návrh.
            </p>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white dark:bg-stone-600 hover:bg-gray-50"
                >
                  Odoslať návrh
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Odoslať návrh autora</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Input placeholder="Meno autora*" {...register("name")} />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      placeholder="Literárne obdobie*"
                      {...register("litPeriod")}
                    />
                    {errors.litPeriod && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.litPeriod.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input type="date" {...register("bornDate")} />
                    {errors.bornDate && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.bornDate.message}
                      </p>
                    )}
                  </div>

                  <Input
                    type="date"
                    placeholder="Dátum úmrtia"
                    {...register("deathDate")}
                  />
                  <Input
                    placeholder="URL obrázku"
                    {...register("authorImage")}
                  />
                  <Textarea
                    placeholder="Stručný životopis"
                    {...register("bio")}
                  />
                  <Input
                    placeholder="Vaše meno (ak nie ste prihlásený)"
                    {...register("suggestedByName")}
                  />

                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Odosielam...
                        </>
                      ) : (
                        "Odoslať návrh"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorsWrapper;
