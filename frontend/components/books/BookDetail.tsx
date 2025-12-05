"use client";

import { FC, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Book as BookIcon, Calendar, User, BookOpen, Clock, ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { Book } from '@/lib/types';
import { mockBooksApi } from '@/lib/mockApi';
import { useAuth } from '@/components/providers/AuthContext';
import { useBorrows } from '@/lib/hooks/useBorrows';

const BookDetail: FC = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { borrowBook, returnBook, checkHasBorrowed, activeBorrows } = useBorrows();

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [currentBorrowId, setCurrentBorrowId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    loadBook();
  }, [params.id]);

  useEffect(() => {
    if (book) {
      checkBorrowStatus();
    }
  }, [book, activeBorrows]);

  const loadBook = async () => {
    const bookId = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!bookId) return;

    setIsLoading(true);
    try {
      const bookData = await mockBooksApi.getById(bookId);
      setBook(bookData);
    } catch (error) {
      console.error('Error loading book:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkBorrowStatus = async () => {
    if (!book || !isAuthenticated) return;

    const hasBorrowed = await checkHasBorrowed(book.id);
    setIsBorrowed(hasBorrowed);

    if (hasBorrowed) {
      const activeBorrow = activeBorrows.find(b => b.bookId === book.id);
      if (activeBorrow) {
        setCurrentBorrowId(activeBorrow.id);
      }
    }
  };

  const handleBorrow = async () => {
    if (!book || !isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      await borrowBook(book.id);
      setIsBorrowed(true);
      setAlertMessage('Kniha bola úspešne vypožičaná. Vrátiť ju musíte do 30 dní.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
      await loadBook(); // Refresh book data
    } catch (error: any) {
      setAlertMessage(error.message || 'Chyba pri vypožičaní knihy');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    }
  };

  const handleReturn = async () => {
    if (!currentBorrowId) return;

    try {
      await returnBook(currentBorrowId);
      setIsBorrowed(false);
      setCurrentBorrowId(null);
      setAlertMessage('Kniha bola úspešne vrátená. Ďakujeme!');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
      await loadBook(); // Refresh book data
    } catch (error: any) {
      setAlertMessage(error.message || 'Chyba pri vrátení knihy');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Kniha nebola nájdená</p>
            <Button onClick={() => router.push('/books')} className="mt-4">
              Späť na knihy
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentBorrow = activeBorrows.find(b => b.bookId === book.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.push('/books')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Späť na zoznam
          </Button>
        </motion.div>

        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20">
                <BookOpen className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  {alertMessage}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="overflow-hidden shadow-lg">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 h-96 flex items-center justify-center text-white relative">
                  <BookIcon className="h-32 w-32 opacity-30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6">
                      <h3 className="text-2xl font-bold mb-2">{book.title}</h3>
                      <p className="text-lg opacity-90">{book.authorName}</p>
                    </div>
                  </div>
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={book.availableCopies > 0 ? "success" : "destructive"} className="text-sm">
                    {book.availableCopies > 0
                      ? `Dostupné: ${book.availableCopies}/${book.totalCopies}`
                      : "Nedostupné"}
                  </Badge>
                </div>

                <AnimatePresence mode="wait">
                  {!isBorrowed && book.availableCopies > 0 && (
                    <motion.div
                      key="borrow"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        onClick={handleBorrow}
                        className="w-full"
                        disabled={!isAuthenticated}
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        {isAuthenticated ? 'Požičať knihu' : 'Prihláste sa'}
                      </Button>
                    </motion.div>
                  )}

                  {isBorrowed && currentBorrow && (
                    <motion.div
                      key="return"
                      className="space-y-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                          Vypožičané do: <strong>
                            {new Date(currentBorrow.dueDate).toLocaleDateString('sk-SK')}
                          </strong>
                        </AlertDescription>
                      </Alert>
                      <Button
                        onClick={handleReturn}
                        variant="outline"
                        className="w-full"
                      >
                        Vrátiť knihu
                      </Button>
                    </motion.div>
                  )}

                  {!isAuthenticated && book.availableCopies > 0 && (
                    <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                      <AlertDescription className="text-yellow-800 dark:text-yellow-200 text-sm">
                        Pre vypožičanie knihy sa musíte prihlásiť
                      </AlertDescription>
                    </Alert>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="md:col-span-2 space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl">{book.title}</CardTitle>
                <CardDescription className="text-lg flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {book.authorName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Popis</h3>
                  <p className="text-muted-foreground leading-relaxed">{book.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">ISBN</h4>
                    <p>{book.isbn}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">Rok vydania</h4>
                    <p className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {book.publishedYear}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">Kategória</h4>
                    <Badge variant="secondary">{book.categoryName}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">Dostupnosť</h4>
                    <p>{book.availableCopies} z {book.totalCopies} kusov</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Podmienky požičania</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Výpožičná doba je 30 dní</p>
                <p>• Možnosť predĺženia o ďalších 14 dní</p>
                <p>• Maximálne 5 kníh naraz na jedného čitateľa</p>
                <p>• Pri omeškaní poplatok 0,50 € za deň</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;