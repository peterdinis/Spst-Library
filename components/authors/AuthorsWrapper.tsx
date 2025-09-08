"use client";

import { useState, useMemo, FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Calendar, Award } from "lucide-react";
import Link from "next/link";
import { useAllAuthors } from "@/hooks/authors/useAllAuthors";

interface Book {
  id: number;
  title: string;
  available: boolean;
}

interface Author {
  id: number;
  name: string;
  bio?: string | null;
  books: Book[];
  litPeriod: string;
  bornDate: string;
  deathDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

const AuthorsWrapper: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useAllAuthors({
    search: searchTerm,
    page: 1,
    limit: 50,
  });

  const authors: any = data?.data || [];

  const authorsWithCounts = useMemo(() => {
    return authors.map((author) => ({
      ...author,
      bookCount: author.books.length,
      availableBooks: author.books.filter((b) => b.available).length,
      genres: author.litPeriod ? [author.litPeriod] : [], // convert litPeriod to array for display
      popularWorks: author.books.slice(0, 3).map((b) => b.title),
      awards: [], // adjust if you have awards
    }));
  }, [authors]);

  const filteredAuthors = useMemo(() => {
    if (!authorsWithCounts) return [];
    return authorsWithCounts.filter(
      (author) =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        author.genres.some((genre) =>
          genre.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [authorsWithCounts, searchTerm]);

  const totalBooks = authorsWithCounts.reduce((sum, author) => sum + author.bookCount, 0);
  const totalAvailable = authorsWithCounts.reduce((sum, author) => sum + author.availableBooks, 0);

  if (isLoading) {
    return <div className="text-center py-12">Loading authors...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Error fetching authors: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header & Stats */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Authors Collection</h1>
          <p className="text-muted-foreground mb-6">
            Discover the brilliant minds behind your favorite books
          </p>

          {/* Stats */}
          <div className="bg-card p-6 rounded-lg shadow-card mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">{authors.length}</div>
                <div className="text-sm text-muted-foreground">Featured Authors</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-8 w-8 text-success" />
                </div>
                <div className="text-2xl font-bold text-foreground">{totalBooks}</div>
                <div className="text-sm text-muted-foreground">Total Works</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-foreground">{totalAvailable}</div>
                <div className="text-sm text-muted-foreground">Available Now</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Search className="h-8 w-8 text-foreground" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {Array.from(new Set(authorsWithCounts.flatMap((a) => a.genres))).length}
                </div>
                <div className="text-sm text-muted-foreground">Genres Covered</div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search authors or genres..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuthors.map((author, index) => (
            <Card key={author.id} className="hover-lift shadow-card group animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-smooth">
                      {author.name}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                      Born {author.bornDate} • {author.deathDate ? `Died ${author.deathDate}` : "Alive"}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {author.availableBooks}/{author.bookCount} available
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{author.bio}</p>

                {/* Genres */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-foreground">Genres:</div>
                  <div className="flex flex-wrap gap-1">
                    {author.genres.map((genre, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{genre}</Badge>
                    ))}
                  </div>
                </div>

                {/* Popular Works */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-foreground">Popular Works:</div>
                  <div className="space-y-1">
                    {author.popularWorks.map((work, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground flex items-center">
                        <BookOpen className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{work}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Link href={`/books?author=${encodeURIComponent(author.name)}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Books by {author.name.split(" ")[0]}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAuthors.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-muted-foreground text-lg">No authors found matching your search.</p>
            <p className="text-muted-foreground">Try a different search term.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center animate-fade-in">
          <div className="bg-gradient-secondary p-8 rounded-lg text-white">
            <h2 className="text-2xl font-bold mb-2">Suggest a New Author</h2>
            <p className="mb-4 opacity-90">Don't see your favorite author? Let us know who you'd like to see in our collection</p>
            <Button variant="outline" size="lg" className="bg-white text-secondary hover:bg-gray-50">
              Submit Suggestion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorsWrapper;
