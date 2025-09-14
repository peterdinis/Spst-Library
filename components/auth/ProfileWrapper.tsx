"use client";

import { FC, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  GraduationCap,
  BookOpen,
  Clock,
  TrendingUp,
  Calendar,
  Award,
  Settings,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProfile } from "@/hooks/auth/useProfile";

const mockBorrowedBooks = [
  {
    id: "1",
    title: "1984",
    author: "George Orwell",
    category: "Science Fiction",
    isbn: "978-0-452-28423-4",
    publishedYear: 1949,
    available: false,
    dueDate: "2024-01-15",
    description:
      "A dystopian social science fiction novel about totalitarian control.",
    borrowedDate: "2024-01-01",
  },
  {
    id: "2",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    category: "Coming of Age",
    isbn: "978-0-316-76948-0",
    publishedYear: 1951,
    available: false,
    dueDate: "2024-01-20",
    description:
      "A controversial novel about teenage rebellion and alienation.",
    borrowedDate: "2024-01-06",
  },
  {
    id: "3",
    title: "Dune",
    author: "Frank Herbert",
    category: "Science Fiction",
    isbn: "978-0-441-17271-9",
    publishedYear: 1965,
    available: false,
    dueDate: "2024-01-25",
    description: "Epic science fiction novel set in a distant future.",
    borrowedDate: "2024-01-11",
  },
];

// Mock reading history
const mockHistory = [
  {
    id: "hist-1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    borrowedDate: "2023-11-15",
    returnedDate: "2023-11-29",
    rating: 5,
  },
  {
    id: "hist-2",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    borrowedDate: "2023-12-01",
    returnedDate: "2023-12-14",
    rating: 4,
  },
  {
    id: "hist-3",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    borrowedDate: "2023-12-16",
    returnedDate: "2023-12-30",
    rating: 5,
  },
];

// Mock stats (this would also come from API)
const mockStats = {
  totalBorrowed: 47,
  currentlyBorrowed: 3,
  overdue: 0,
  readingStreak: 12,
  memberSince: "September 2023",
};

const ProfileWrapper: FC = () => {
  const [borrowedBooks, setBorrowedBooks] = useState(mockBorrowedBooks);
  const { toast } = useToast();

  // Use the profile hook
  const { data: user, isLoading, error, refetch, isError } = useProfile();

  const handleReturnBook = (bookId: string) => {
    setBorrowedBooks((books) => books.filter((book) => book.id !== bookId));
    toast({
      title: "Book returned successfully!",
      description: "Thank you for returning the book on time.",
    });
  };

  const handleRenewBook = (bookId: string) => {
    setBorrowedBooks((books) =>
      books.map((book) =>
        book.id === bookId
          ? {
              ...book,
              dueDate: new Date(
                Date.now() + 14 * 24 * 60 * 60 * 1000,
              ).toISOString(),
            }
          : book,
      ),
    );
    toast({
      title: "Book renewed successfully!",
      description: "Your borrowing period has been extended by 2 weeks.",
    });
  };

  const overdueBooks = borrowedBooks.filter(
    (book) => new Date(book.dueDate) < new Date(),
  );
  const upcomingDue = borrowedBooks.filter((book) => {
    const dueDate = new Date(book.dueDate);
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    return dueDate <= threeDaysFromNow && dueDate >= new Date();
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Unable to load profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                {error?.message || "Failed to load user profile"}
              </AlertDescription>
            </Alert>
            <div className="flex space-x-2">
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="flex-1"
              >
                Try Again
              </Button>
              <Button asChild className="flex-1">
                <a href="/login">Go to Login</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8 animate-fade-in">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{user.name}</CardTitle>
                  <CardDescription className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>{user.role.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Member since{" "}
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
                  </CardDescription>
                </div>

                <Button variant="outline" size="sm" className="self-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
          <Card className="text-center hover-lift shadow-card">
            <CardContent className="p-4">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">
                {mockStats.currentlyBorrowed}
              </div>
              <div className="text-sm text-muted-foreground">
                Currently Borrowed
              </div>
            </CardContent>
          </Card>

          <Card className="text-center hover-lift shadow-card">
            <CardContent className="p-4">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-success" />
              <div className="text-2xl font-bold text-foreground">
                {mockStats.totalBorrowed}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Books Read
              </div>
            </CardContent>
          </Card>

          <Card className="text-center hover-lift shadow-card">
            <CardContent className="p-4">
              <Clock className="h-8 w-8 mx-auto mb-2 text-secondary" />
              <div className="text-2xl font-bold text-foreground">
                {mockStats.readingStreak}
              </div>
              <div className="text-sm text-muted-foreground">
                Day Reading Streak
              </div>
            </CardContent>
          </Card>

          <Card className="text-center hover-lift shadow-card">
            <CardContent className="p-4">
              <Award className="h-8 w-8 mx-auto mb-2 text-accent" />
              <div className="text-2xl font-bold text-foreground">
                {mockStats.overdue}
              </div>
              <div className="text-sm text-muted-foreground">Overdue Books</div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {(overdueBooks.length > 0 || upcomingDue.length > 0) && (
          <div className="mb-8 space-y-4 animate-fade-in">
            {overdueBooks.length > 0 && (
              <Card className="border-destructive bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Overdue Books ({overdueBooks.length})
                  </CardTitle>
                  <CardDescription>
                    Please return these books as soon as possible to avoid late
                    fees.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {upcomingDue.length > 0 && (
              <Card className="border-secondary bg-secondary/5">
                <CardHeader>
                  <CardTitle className="text-secondary flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Due Soon ({upcomingDue.length})
                  </CardTitle>
                  <CardDescription>
                    These books are due within the next 3 days.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="borrowed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="borrowed">Currently Borrowed</TabsTrigger>
            <TabsTrigger value="history">Reading History</TabsTrigger>
          </TabsList>

          {/* Currently Borrowed */}
          <TabsContent value="borrowed" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Currently Borrowed Books</h2>
              <Badge variant="outline">{borrowedBooks.length} books</Badge>
            </div>

            {borrowedBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {borrowedBooks.map((book, index) => (
                  <div
                    key={book.id}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Card className="hover-lift shadow-card">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
                              {book.title}
                            </CardTitle>
                            <div className="flex items-center space-x-1 mt-2 text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span className="text-sm">{book.author}</span>
                            </div>
                          </div>
                          <Badge
                            variant={
                              new Date(book.dueDate) < new Date()
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {new Date(book.dueDate) < new Date()
                              ? "Overdue"
                              : "Borrowed"}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="pb-4">
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="h-4 w-4" />
                            <span>{book.category}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Borrowed:{" "}
                              {new Date(book.borrowedDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              Due: {new Date(book.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {book.description && (
                          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                            {book.description}
                          </p>
                        )}
                      </CardContent>

                      <div className="p-6 pt-0 space-y-2">
                        <Button
                          onClick={() => handleReturnBook(book.id)}
                          className="w-full"
                          variant="default"
                        >
                          Return Book
                        </Button>
                        <Button
                          onClick={() => handleRenewBook(book.id)}
                          className="w-full"
                          variant="outline"
                        >
                          Renew (14 days)
                        </Button>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 animate-fade-in">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">
                  No books currently borrowed
                </h3>
                <p className="text-muted-foreground mb-4">
                  Browse our collection to find your next great read!
                </p>
                <Button asChild>
                  <a href="/books">Browse Books</a>
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Reading History */}
          <TabsContent value="history" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Reading History</h2>
              <Badge variant="outline">
                {mockHistory.length} books completed
              </Badge>
            </div>

            <div className="space-y-4">
              {mockHistory.map((book, index) => (
                <Card
                  key={book.id}
                  className="hover-lift shadow-card animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{book.title}</h3>
                        <p className="text-muted-foreground">
                          by {book.author}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span>
                            Borrowed:{" "}
                            {new Date(book.borrowedDate).toLocaleDateString()}
                          </span>
                          <span>
                            Returned:{" "}
                            {new Date(book.returnedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${i < book.rating ? "text-secondary" : "text-muted"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileWrapper;
