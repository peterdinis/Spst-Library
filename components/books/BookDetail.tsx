"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  User, 
  ArrowLeft, 
  Clock,
  Star,
  Users,
  FileText,
  Hash
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { BorrowData, BorrowDialog } from "../borrow/BorrowDialog";
import Link from "next/link";
import { Separator } from "../ui/separator";

// Mock data - in a real app this would come from an API
const mockBooks = [
  {
    id: "1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Classic Literature",
    isbn: "978-0-06-112008-4",
    publishedYear: 1960,
    available: true,
    description: "A gripping tale of racial injustice and the loss of innocence in the American South. Set in the fictional town of Maycomb, Alabama, in the 1930s, the story is told through the eyes of Scout Finch, a young girl whose father, Atticus, is a lawyer defending a black man falsely accused of rape. Through Scout's innocent perspective, Harper Lee explores themes of moral growth, prejudice, and the complexities of human nature in a divided society.",
    fullDescription: "Harper Lee's Pulitzer Prize-winning masterpiece explores the roots of human behavior through the story of Scout Finch and her father, Atticus. Set in a sleepy Alabama town in the 1930s, the novel addresses issues of race, class, and moral courage through the trial of Tom Robinson, a black man accused of rape. The story is told from the perspective of six-year-old Scout, whose coming-of-age journey reveals the harsh realities of prejudice and injustice. Through Atticus Finch's unwavering moral compass and the children's encounters with their mysterious neighbor Boo Radley, Lee crafts a powerful narrative about empathy, understanding, and the loss of innocence. The novel remains one of the most important works of American literature, offering timeless lessons about standing up for what's right, even in the face of overwhelming opposition.",
    pages: 376,
    language: "English",
    publisher: "Harper & Row",
    rating: 4.8,
    totalRatings: 2847,
    genres: ["Classic Literature", "Fiction", "Historical Fiction", "Coming of Age"],
    tags: ["Pulitzer Prize Winner", "American Literature", "Social Justice", "Childhood"],
    copiesTotal: 8,
    copiesAvailable: 5
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    category: "Science Fiction",
    isbn: "978-0-452-28423-4",
    publishedYear: 1949,
    available: false,
    dueDate: "2024-01-15",
    description: "A dystopian social science fiction novel about totalitarian control.",
    fullDescription: "George Orwell's chilling vision of a totalitarian society where Big Brother watches everything and the Thought Police monitor even your thoughts. Winston Smith works for the Ministry of Truth, rewriting history to fit the Party's current narrative. In this world, facts are malleable, privacy is extinct, and individual thought is the ultimate crime. When Winston begins a forbidden love affair with Julia and starts to question the Party's control, he embarks on a dangerous journey toward truth and freedom. Set in a future London, the novel introduces concepts like 'doublethink,' 'newspeak,' and 'thoughtcrime' that have become part of our cultural vocabulary. Orwell's masterpiece remains a powerful warning about the dangers of unchecked government power and the fragility of truth in the face of propaganda.",
    pages: 328,
    language: "English", 
    publisher: "Secker & Warburg",
    rating: 4.7,
    totalRatings: 3421,
    genres: ["Science Fiction", "Dystopian", "Political Fiction", "Classic Literature"],
    tags: ["Totalitarianism", "Surveillance", "Political Satire", "Mind Control"],
    copiesTotal: 6,
    copiesAvailable: 0
  },
  // Add more mock books as needed
];

export default function BookDetail() {
  const { id } = useParams();
  const router = useRouter()
  const [book, setBook] = useState(null);
  const [showBorrowDialog, setShowBorrowDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this would be an API call
    const foundBook = mockBooks.find(b => b.id === id);
    if (foundBook) {
      setBook(foundBook);
    } else {
      router.push("/books");
      toast({
        title: "Book not found",
        description: "The requested book could not be found.",
        variant: "destructive",
      });
    }
  }, [id, router, toast]);

  const handleBorrow = (borrowData: BorrowData) => {
    if (!book) return;

    toast({
      title: "Book borrowed successfully!",
      description: `${borrowData.name} ${borrowData.lastName} has borrowed "${book.title}" from ${borrowData.fromDate.toLocaleDateString()} to ${borrowData.toDate.toLocaleDateString()}`,
    });

    // Update book availability (in real app, this would be an API call)
    setBook(prev => prev ? { ...prev, available: false, dueDate: borrowData.toDate.toISOString() } : null);
  };

  const handleReturn = () => {
    if (!book) return;

    toast({
      title: "Book returned successfully!",
      description: `Thank you for returning "${book.title}".`,
    });

    // Update book availability (in real app, this would be an API call)
    setBook(prev => prev ? { ...prev, available: true, dueDate: undefined } : null);
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Loading book details...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => router.push("")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Books</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Book Header */}
            <Card className="shadow-card animate-slide-up">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-bold mb-2">{book.title}</CardTitle>
                    <CardDescription className="text-lg flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>by {book.author}</span>
                    </CardDescription>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {book.genres?.map((genre, index) => (
                        <Badge key={index} variant="secondary">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge 
                      variant={book.available ? "default" : "secondary"}
                      className={`text-lg px-4 py-2 ${book.available ? "bg-success text-success-foreground" : ""}`}
                    >
                      {book.available ? "Available" : "Borrowed"}
                    </Badge>
                    {!book.available && book.dueDate && (
                      <div className="text-sm text-muted-foreground mt-2 flex items-center justify-end">
                        <Clock className="h-4 w-4 mr-1" />
                        Due: {new Date(book.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Description */}
            <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Description</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {book.fullDescription || book.description}
                </p>
              </CardContent>
            </Card>

            {/* Tags */}
            {book.tags && book.tags.length > 0 && (
              <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Hash className="h-5 w-5" />
                    <span>Tags</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {book.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-accent/10">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="shadow-card animate-scale-in">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {book.available ? (
                  <Button 
                    onClick={() => setShowBorrowDialog(true)}
                    className="w-full"
                    size="lg"
                  >
                    Borrow Book
                  </Button>
                ) : (
                  <Button 
                    onClick={handleReturn}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    Return Book
                  </Button>
                )}
                
                <Button variant="outline" className="w-full" size="lg">
                  Add to Wishlist
                </Button>
                
                <Link href={`/books?author=${encodeURIComponent(book.author)}`}>
                  <Button variant="ghost" className="w-full" size="lg">
                    More by Author
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Book Details */}
            <Card className="shadow-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle>Book Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ISBN:</span>
                    <span className="font-mono text-sm">{book.isbn}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Published:</span>
                    <span>{book.publishedYear}</span>
                  </div>
                  
                  <Separator />
                  
                  {book.pages && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pages:</span>
                        <span>{book.pages}</span>
                      </div>
                      <Separator />
                    </>
                  )}
                  
                  {book.language && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Language:</span>
                        <span>{book.language}</span>
                      </div>
                      <Separator />
                    </>
                  )}
                  
                  {book.publisher && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Publisher:</span>
                        <span>{book.publisher}</span>
                      </div>
                      <Separator />
                    </>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <Badge variant="outline">{book.category}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating & Availability */}
            <Card className="shadow-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle>Rating & Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {book.rating && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 fill-secondary text-secondary" />
                      <span className="font-semibold">{book.rating}/5</span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      ({book.totalRatings} reviews)
                    </span>
                  </div>
                )}
                
                {book.copiesTotal && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span>Copies Available:</span>
                      </div>
                      <span className="font-semibold">
                        {book.copiesAvailable}/{book.copiesTotal}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Borrow Dialog */}
      <BorrowDialog
        open={showBorrowDialog}
        onOpenChange={setShowBorrowDialog}
        bookTitle={book.title}
        onConfirm={handleBorrow}
      />
    </div>
  );
}