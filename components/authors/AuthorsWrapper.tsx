"use client";

import { useState, useMemo, FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Calendar, Award } from "lucide-react";
import Link from "next/link";

interface Author {
  id: string;
  name: string;
  biography: string;
  birthYear: number;
  nationality: string;
  genres: string[];
  bookCount: number;
  availableBooks: number;
  popularWorks: string[];
  awards: string[];
  imageUrl?: string;
}

const mockAuthors: Author[] = [
  {
    id: "1",
    name: "Harper Lee",
    biography:
      "Harper Lee was an American novelist best known for her 1960 novel To Kill a Mockingbird.",
    birthYear: 1926,
    nationality: "American",
    genres: ["Classic Literature", "Fiction"],
    bookCount: 2,
    availableBooks: 1,
    popularWorks: ["To Kill a Mockingbird", "Go Set a Watchman"],
    awards: ["Pulitzer Prize", "Presidential Medal of Freedom"],
  },
  {
    id: "2",
    name: "George Orwell",
    biography:
      "Eric Blair, known by his pen name George Orwell, was an English novelist and essayist.",
    birthYear: 1903,
    nationality: "British",
    genres: ["Science Fiction", "Political Fiction", "Dystopian"],
    bookCount: 4,
    availableBooks: 2,
    popularWorks: ["1984", "Animal Farm", "Homage to Catalonia"],
    awards: ["Prometheus Hall of Fame Award"],
  },
  {
    id: "3",
    name: "F. Scott Fitzgerald",
    biography:
      "Francis Scott Key Fitzgerald was an American novelist and short story writer.",
    birthYear: 1896,
    nationality: "American",
    genres: ["Classic Literature", "Modernist"],
    bookCount: 3,
    availableBooks: 2,
    popularWorks: [
      "The Great Gatsby",
      "Tender Is the Night",
      "This Side of Paradise",
    ],
    awards: ["American Academy of Arts and Letters"],
  },
  {
    id: "4",
    name: "Jane Austen",
    biography:
      "Jane Austen was an English novelist known primarily for her six major novels.",
    birthYear: 1775,
    nationality: "British",
    genres: ["Romance", "Classic Literature", "Regency"],
    bookCount: 6,
    availableBooks: 4,
    popularWorks: ["Pride and Prejudice", "Sense and Sensibility", "Emma"],
    awards: ["Literary Hall of Fame"],
  },
  {
    id: "5",
    name: "J.D. Salinger",
    biography:
      "Jerome David Salinger was an American writer known for his novel The Catcher in the Rye.",
    birthYear: 1919,
    nationality: "American",
    genres: ["Coming of Age", "Literary Fiction"],
    bookCount: 2,
    availableBooks: 0,
    popularWorks: ["The Catcher in the Rye", "Nine Stories"],
    awards: ["National Book Award nominee"],
  },
  {
    id: "6",
    name: "William Golding",
    biography:
      "Sir William Gerald Golding was a British novelist and playwright.",
    birthYear: 1911,
    nationality: "British",
    genres: ["Adventure", "Allegory", "Fiction"],
    bookCount: 3,
    availableBooks: 2,
    popularWorks: ["Lord of the Flies", "The Inheritors", "Pincher Martin"],
    awards: ["Nobel Prize in Literature", "Booker Prize"],
  },
  {
    id: "7",
    name: "Agatha Christie",
    biography:
      "Dame Agatha Mary Clarissa Christie was an English writer known for her detective novels.",
    birthYear: 1890,
    nationality: "British",
    genres: ["Mystery", "Crime", "Detective Fiction"],
    bookCount: 12,
    availableBooks: 8,
    popularWorks: [
      "Murder on the Orient Express",
      "The Murder of Roger Ackroyd",
      "And Then There Were None",
    ],
    awards: ["Grand Master Award", "Order of the British Empire"],
  },
  {
    id: "8",
    name: "Mark Twain",
    biography:
      "Samuel Langhorne Clemens, known by his pen name Mark Twain, was an American writer and humorist.",
    birthYear: 1835,
    nationality: "American",
    genres: ["Adventure", "Satire", "American Literature"],
    bookCount: 5,
    availableBooks: 4,
    popularWorks: [
      "The Adventures of Tom Sawyer",
      "Adventures of Huckleberry Finn",
      "The Prince and the Pauper",
    ],
    awards: ["American Academy of Arts and Letters"],
  },
];

const AuthorsWrapper: FC = () => {
  const [authors] = useState(mockAuthors);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAuthors = useMemo(() => {
    return authors.filter(
      (author) =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        author.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        author.genres.some((genre) =>
          genre.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );
  }, [authors, searchTerm]);

  const totalBooks = authors.reduce((sum, author) => sum + author.bookCount, 0);
  const totalAvailable = authors.reduce(
    (sum, author) => sum + author.availableBooks,
    0,
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Authors Collection
          </h1>
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
                <div className="text-2xl font-bold text-foreground">
                  {authors.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Featured Authors
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-8 w-8 text-success" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {totalBooks}
                </div>
                <div className="text-sm text-muted-foreground">Total Works</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-8 w-8 text-secondary" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {totalAvailable}
                </div>
                <div className="text-sm text-muted-foreground">
                  Available Now
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Search className="h-8 w-8 text-accent" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {Array.from(new Set(authors.flatMap((a) => a.genres))).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Genres Covered
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search authors, genres, or nationality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Authors Grid */}
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
                      {author.nationality} • Born {author.birthYear}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary"
                  >
                    {author.availableBooks}/{author.bookCount} available
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {author.biography}
                </p>

                {/* Genres */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-foreground">
                    Genres:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {author.genres.map((genre, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Popular Works */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-foreground">
                    Popular Works:
                  </div>
                  <div className="space-y-1">
                    {author.popularWorks.slice(0, 3).map((work, idx) => (
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

                {/* Awards */}
                {author.awards.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">
                      Awards:
                    </div>
                    <div className="space-y-1">
                      {author.awards.slice(0, 2).map((award, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-muted-foreground flex items-center"
                        >
                          <Award className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="line-clamp-1">{award}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    href={`/books?author=${encodeURIComponent(author.name)}`}
                  >
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
            <p className="text-muted-foreground text-lg">
              No authors found matching your search.
            </p>
            <p className="text-muted-foreground">
              Try a different search term.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center animate-fade-in">
          <div className="bg-gradient-secondary p-8 rounded-lg text-white">
            <h2 className="text-2xl font-bold mb-2">Suggest a New Author</h2>
            <p className="mb-4 opacity-90">
              Don't see your favorite author? Let us know who you'd like to see
              in our collection
            </p>
            <Button
              variant="outline"
              size="lg"
              className="bg-white text-secondary hover:bg-gray-50"
            >
              Submit Suggestion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorsWrapper;
