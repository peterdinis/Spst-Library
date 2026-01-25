import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Download, 
  Eye, 
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Mock data for borrowed books
const mockBorrowedBooks = [
  {
    id: "1",
    bookId: "book_1",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    coverImage: "/api/placeholder/400/600",
    borrowedDate: "2024-01-10",
    dueDate: "2024-01-24",
    returnDate: null,
    status: "active",
    daysRemaining: 4,
    renewalsLeft: 2,
    isOverdue: false,
    fineAmount: 0,
  },
  {
    id: "2",
    bookId: "book_2",
    title: "The Pragmatic Programmer",
    author: "David Thomas, Andrew Hunt",
    coverImage: "/api/placeholder/400/600",
    borrowedDate: "2024-01-05",
    dueDate: "2024-01-19",
    returnDate: null,
    status: "overdue",
    daysRemaining: -2,
    renewalsLeft: 0,
    isOverdue: true,
    fineAmount: 1.50,
  },
  {
    id: "3",
    bookId: "book_3",
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma, et al.",
    coverImage: "/api/placeholder/400/600",
    borrowedDate: "2024-01-12",
    dueDate: "2024-01-26",
    returnDate: null,
    status: "active",
    daysRemaining: 10,
    renewalsLeft: 3,
    isOverdue: false,
    fineAmount: 0,
  },
  {
    id: "4",
    bookId: "book_4",
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    coverImage: "/api/placeholder/400/600",
    borrowedDate: "2023-12-20",
    dueDate: "2024-01-03",
    returnDate: "2024-01-02",
    status: "returned",
    daysRemaining: 0,
    renewalsLeft: 0,
    isOverdue: false,
    fineAmount: 0,
  },
  {
    id: "5",
    bookId: "book_5",
    title: "You Don't Know JS: Scope & Closures",
    author: "Kyle Simpson",
    coverImage: "/api/placeholder/400/600",
    borrowedDate: "2024-01-15",
    dueDate: "2024-01-29",
    returnDate: null,
    status: "active",
    daysRemaining: 12,
    renewalsLeft: 3,
    isOverdue: false,
    fineAmount: 0,
  },
];

// Query function
async function fetchBorrowedBooks(userId: string) {
  // This would be an API call in real app
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockBorrowedBooks;
}

export const Route = createFileRoute("/profile")({
  component: BorrowedBooksPage,
});

function BorrowedBooksPage() {
  const { data: borrowedBooks, isLoading, error } = useQuery({
    queryKey: ["borrowedBooks", "current"],
    queryFn: () => fetchBorrowedBooks("user_123"),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="h-40 w-28 bg-muted rounded" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error loading books</h3>
          <p className="text-muted-foreground">Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  const activeBooks = borrowedBooks?.filter(b => b.status === "active");
  const overdueBooks = borrowedBooks?.filter(b => b.isOverdue);
  const returnedBooks = borrowedBooks?.filter(b => b.status === "returned");

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{activeBooks?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Currently borrowed</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-red-500">{overdueBooks?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Need attention</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Fines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">
                  €{borrowedBooks?.reduce((sum, b) => sum + b.fineAmount, 0).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Pending payment</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Books List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Your Borrowed Books</h2>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
        </div>

        <Separator />

        {borrowedBooks?.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No books borrowed</h3>
              <p className="text-muted-foreground mb-4">
                You haven't borrowed any books yet. Browse our collection to get started.
              </p>
              <Button>Browse Books</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {borrowedBooks?.map((book) => (
              <Card key={book.id} className={book.isOverdue ? "border-red-500/50" : ""}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Book Cover */}
                    <div className="md:w-32">
                      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-muted">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="object-cover w-full h-full"
                        />
                        {book.isOverdue && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="destructive" className="animate-pulse">
                              Overdue
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Book Details */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold tracking-tight">
                            {book.title}
                          </h3>
                          <p className="text-muted-foreground">{book.author}</p>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant={book.status === "active" ? "default" : "secondary"}>
                              {book.status === "active" ? (
                                <>
                                  <Clock className="h-3 w-3 mr-1" />
                                  Due in {book.daysRemaining} days
                                </>
                              ) : book.status === "overdue" ? (
                                <>
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Overdue by {Math.abs(book.daysRemaining)} days
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Returned
                                </>
                              )}
                            </Badge>
                            
                            <Badge variant="outline">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {book.renewalsLeft} renewals left
                            </Badge>

                            {book.fineAmount > 0 && (
                              <Badge variant="destructive">
                                Fine: €{book.fineAmount.toFixed(2)}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Borrowed:</span>
                              <span>{format(new Date(book.borrowedDate), "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Due:</span>
                              <span className={book.isOverdue ? "text-red-500 font-medium" : ""}>
                                {format(new Date(book.dueDate), "MMM d, yyyy")}
                              </span>
                            </div>
                            {book.returnDate && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Returned:</span>
                                <span>{format(new Date(book.returnDate), "MMM d, yyyy")}</span>
                              </div>
                            )}
                          </div>

                          {/* Progress Bar */}
                          {book.status === "active" && !book.isOverdue && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Time remaining</span>
                                <span>{book.daysRemaining}/14 days</span>
                              </div>
                              <Progress 
                                value={(book.daysRemaining / 14) * 100} 
                                className="h-2"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 mt-6">
                        <Button 
                          size="sm" 
                          disabled={book.status === "returned" || book.renewalsLeft === 0}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Renew Loan
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={book.status === "returned"}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        
                        {book.fineAmount > 0 && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                          >
                            Pay Fine
                          </Button>
                        )}
                        
                        {book.isOverdue && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Report Issue
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Reading Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Reading Statistics</CardTitle>
          <CardDescription>
            Your reading habits and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Books Read</p>
              <p className="text-3xl font-bold">42</p>
              <p className="text-xs text-muted-foreground">+5 this month</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Avg. Reading Time</p>
              <p className="text-3xl font-bold">14 days</p>
              <p className="text-xs text-muted-foreground">Per book</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Favorite Genre</p>
              <p className="text-3xl font-bold">Programming</p>
              <p className="text-xs text-muted-foreground">68% of books</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="text-3xl font-bold">2022</p>
              <p className="text-xs text-muted-foreground">2 years active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Due Dates */}
      {activeBooks && activeBooks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Due Dates</CardTitle>
            <CardDescription>
              Books that need to be returned soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeBooks
                .sort((a, b) => a.daysRemaining - b.daysRemaining)
                .slice(0, 3)
                .map((book) => (
                  <div key={book.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-8 bg-muted rounded overflow-hidden">
                        <img 
                          src={book.coverImage} 
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{book.title}</p>
                        <p className="text-sm text-muted-foreground">Due in {book.daysRemaining} days</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(new Date(book.dueDate), "MMM d")}
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}