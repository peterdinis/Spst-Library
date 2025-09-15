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
  Calendar,
  Award,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useProfile } from "@/hooks/auth/useProfile";

const mockBorrowedBooks = [
  {
    id: "1",
    title: "1984",
    author: "George Orwell",
    category: "Sci-fi",
    dueDate: "2024-01-15",
    borrowedDate: "2024-01-01",
    description: "Dystopický román o totalitnej kontrole spoločnosti.",
  },
  {
    id: "2",
    title: "Kto chytá v žite",
    author: "J.D. Salinger",
    category: "Príbeh dospievania",
    dueDate: "2024-01-20",
    borrowedDate: "2024-01-06",
    description: "Kontroverzný román o rebelii a odcudzení dospievajúcich.",
  },
  {
    id: "3",
    title: "Duna",
    author: "Frank Herbert",
    category: "Sci-fi",
    dueDate: "2024-01-25",
    borrowedDate: "2024-01-11",
    description: "Epický sci-fi román odohrávajúci sa v budúcnosti.",
  },
];

const mockStats = {
  totalBorrowed: 47,
  currentlyBorrowed: 3,
  overdue: 0,
  memberSince: "September 2023",
};

const ProfileWrapper: FC = () => {
  const [borrowedBooks, setBorrowedBooks] = useState(mockBorrowedBooks);
  const { toast } = useToast();
  const { data: user, isLoading, error, refetch, isError } = useProfile();

  const handleReturnBook = (bookId: string) => {
    setBorrowedBooks((books) => books.filter((book) => book.id !== bookId));
    toast({
      title: "Kniha bola vrátená!",
      description: "Ďakujeme, že ste knihu vrátili načas.",
    });
  };

  const handleRenewBook = (bookId: string) => {
    setBorrowedBooks((books) =>
      books.map((book) =>
        book.id === bookId
          ? {
              ...book,
              dueDate: new Date(
                Date.now() + 14 * 24 * 60 * 60 * 1000
              ).toISOString(),
            }
          : book
      )
    );
    toast({
      title: "Kniha bola predĺžená!",
      description: "Doba výpožičky bola predĺžená o 2 týždne.",
    });
  };

  const overdueBooks = borrowedBooks.filter(
    (book) => new Date(book.dueDate) < new Date()
  );
  const upcomingDue = borrowedBooks.filter((book) => {
    const dueDate = new Date(book.dueDate);
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    return dueDate <= threeDaysFromNow && dueDate >= new Date();
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground ml-4">Načítavam váš profil...</p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Nepodarilo sa načítať profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-destructive">
              {error?.message || "Nepodarilo sa načítať váš profil"}
            </p>
            <div className="flex space-x-2">
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="flex-1"
              >
                Skúsiť znova
              </Button>
              <Button asChild className="flex-1">
                <a href="/login">Prejsť na prihlásenie</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      {/* Profilová hlavička */}
      <Card className="mb-8 shadow-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
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
                    Člen od{" "}
                    {new Date(user.createdAt).toLocaleDateString("sk-SK", {
                      year: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Štatistiky */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="text-center hover-lift shadow-card">
          <CardContent className="p-4">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">
              {mockStats.currentlyBorrowed}
            </div>
            <div className="text-sm text-muted-foreground">Aktuálne požičané</div>
          </CardContent>
        </Card>

        <Card className="text-center hover-lift shadow-card">
          <CardContent className="p-4">
            <Award className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {mockStats.totalBorrowed}
            </div>
            <div className="text-sm text-muted-foreground">Prečítané knihy</div>
          </CardContent>
        </Card>

        <Card className="text-center hover-lift shadow-card">
          <CardContent className="p-4">
            <Award className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {mockStats.overdue}
            </div>
            <div className="text-sm text-muted-foreground">Požičky po termíne</div>
          </CardContent>
        </Card>
      </div>

      {/* Upozornenia */}
      {(overdueBooks.length > 0 || upcomingDue.length > 0) && (
        <div className="mb-8 space-y-4">
          {overdueBooks.length > 0 && (
            <Card className="border-destructive bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Požičky po termíne ({overdueBooks.length})
                </CardTitle>
                <CardDescription>
                  Prosím vráťte tieto knihy čo najskôr, aby ste sa vyhli poplatkom za oneskorenie.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
          {upcomingDue.length > 0 && (
            <Card className="border-secondary bg-secondary/5">
              <CardHeader>
                <CardTitle className="text-secondary flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Termín blízko ({upcomingDue.length})
                </CardTitle>
                <CardDescription>
                  Tieto knihy budú splatné do 3 dní.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      )}

      {/* Aktuálne požičané knihy */}
      <h2 className="text-2xl font-bold mb-6">Aktuálne požičané knihy</h2>

      {borrowedBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {borrowedBooks.map((book) => (
            <Card key={book.id} className="hover-lift shadow-card">
              <CardHeader className="pb-4 flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {book.title}
                  </CardTitle>
                  <div className="flex items-center space-x-1 mt-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{book.author}</span>
                  </div>
                </div>
                <Badge
                  variant={new Date(book.dueDate) < new Date() ? "destructive" : "secondary"}
                >
                  {new Date(book.dueDate) < new Date() ? "Po termíne" : "Požičané"}
                </Badge>
              </CardHeader>

              <CardContent className="pb-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{book.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Požičané: {new Date(book.borrowedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Termín: {new Date(book.dueDate).toLocaleDateString()}</span>
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
                  Vrátiť knihu
                </Button>
                <Button
                  onClick={() => handleRenewBook(book.id)}
                  className="w-full"
                  variant="outline"
                >
                  Predĺžiť (14 dní)
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Žiadne aktuálne požičané knihy</h3>
          <p className="text-muted-foreground mb-4">
            Prezrite si našu knižnicu a nájdite si svoju ďalšiu knihu!
          </p>
          <Button asChild>
            <a href="/books">Prehľadať knihy</a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileWrapper;
