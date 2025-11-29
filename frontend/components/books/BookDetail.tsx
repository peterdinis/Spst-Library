import { FC, useState } from 'react';
import { Book, Calendar, User, BookOpen, Clock, ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';

const BookDetail: FC = () => {
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const book = {
    title: "Majster a Margaréta",
    author: "Michail Bulgakov",
    isbn: "978-80-556-2345-6",
    publisher: "Slovenské vydavateľstvo",
    year: 2020,
    pages: 456,
    language: "Slovenčina",
    category: "Svetová literatúra",
    available: 3,
    total: 5,
    description: "Majster a Margaréta je jedným z najvýznamnejších diel svetovej literatúry 20. storočia. Román spája satirický pohľad na sovietsku spoločnosť s nadčasovým príbehom o láske, umení a vernosti. Príbeh sa odohráva v Moskve 30. rokov, kde sa objaví tajomný cudzinec Woland so svojím podivným sprievodom.",
    coverColor: "bg-gradient-to-br from-purple-600 to-pink-600"
  };

  const handleBorrow = () => {
    setIsBorrowed(true);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleReturn = () => {
    setIsBorrowed(false);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header s návratom */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button variant="ghost" className="mb-6 hover:bg-white/50">
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
              <Alert className="mb-6 border-green-200 bg-green-50">
                <BookOpen className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {isBorrowed 
                    ? "Kniha bola úspešne vypožičaná. Vrátiť ju musíte do 30 dní."
                    : "Kniha bola úspešne vrátená. Ďakujeme!"}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Ľavý stĺpec - obrázok knihy */}
          <motion.div 
            className="md:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="overflow-hidden shadow-lg">
              <motion.div 
                className={`${book.coverColor} h-96 flex items-center justify-center text-white relative`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Book className="h-32 w-32 opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <h3 className="text-2xl font-bold mb-2">{book.title}</h3>
                    <p className="text-lg opacity-90">{book.author}</p>
                  </div>
                </div>
              </motion.div>
              <CardContent className="p-4">
                <motion.div 
                  className="flex items-center justify-between mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge variant={book.available > 0 ? "default" : "destructive"} className="text-sm">
                    {book.available > 0 ? `Dostupné: ${book.available}/${book.total}` : "Nedostupné"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={isFavorite ? "text-red-500" : "text-gray-400"}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                    </motion.div>
                  </Button>
                </motion.div>
                
                <AnimatePresence mode="wait">
                  {!isBorrowed && book.available > 0 && (
                    <motion.div
                      key="borrow"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button 
                        onClick={handleBorrow} 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Požičať knihu
                      </Button>
                    </motion.div>
                  )}
                  
                  {isBorrowed && (
                    <motion.div 
                      key="return"
                      className="space-y-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Alert className="border-blue-200 bg-blue-50">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800 text-sm">
                          Vypožičané do: <strong>29.12.2025</strong>
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
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pravý stĺpec - informácie */}
          <motion.div 
            className="md:col-span-2 space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-3xl">{book.title}</CardTitle>
                  <CardDescription className="text-lg flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {book.author}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Popis</h3>
                    <p className="text-gray-700 leading-relaxed">{book.description}</p>
                  </div>

                  <motion.div 
                    className="grid grid-cols-2 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 mb-1">ISBN</h4>
                      <p className="text-gray-900">{book.isbn}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 mb-1">Vydavateľ</h4>
                      <p className="text-gray-900">{book.publisher}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 mb-1">Rok vydania</h4>
                      <p className="text-gray-900 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {book.year}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 mb-1">Počet strán</h4>
                      <p className="text-gray-900">{book.pages}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 mb-1">Jazyk</h4>
                      <p className="text-gray-900">{book.language}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 mb-1">Kategória</h4>
                      <Badge variant="secondary">{book.category}</Badge>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Podmienky požičania</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-700">
                  <p>• Výpožičná doba je 30 dní</p>
                  <p>• Možnosť predĺženia o ďalších 14 dní</p>
                  <p>• Maximálne 5 kníh naraz na jedného čitateľa</p>
                  <p>• Pri omeškaní poplatok 0,50 € za deň</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;