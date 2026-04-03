"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Star, User, Library, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { borrowBookAction } from "@/lib/actions";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { mockAuthors } from "@/lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

type BookDetailsClientProps = {
  book: any;
  user: any;
};

export function BookDetailsClient({ book, user }: BookDetailsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { execute, isExecuting } = useAction(borrowBookAction, {
    onSuccess: () => {
      toast.success("Kniha bola úspešne vypožičaná!");
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.error.serverError || "Zlyhalo vypožičanie knihy.");
    }
  });

  const handleConfirmBorrow = () => {
    execute({ bookId: book.id });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16">
      <Link href="/books">
        <Button variant="ghost" className="mb-4 rounded-full pl-2 hover:bg-primary/10 hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Katalóg Kníh
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
        <div className="lg:col-span-4 perspective-1000">
          <motion.div 
            initial={{ rotateY: -15, rotateX: 5, opacity: 0, scale: 0.9 }}
            animate={{ rotateY: 0, rotateX: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative"
          >
            <Card className="overflow-hidden border-0 shadow-2xl rounded-3xl bg-slate-900/5 dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-white/10 group">
              {book.coverUrl ? (
                <div className="relative w-full aspect-[2/3]">
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ) : (
                <div className="w-full aspect-[2/3] bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-slate-400 group-hover:brightness-110 transition-all">
                  <BookOpen className="h-24 w-24 opacity-50 drop-shadow-lg" />
                </div>
              )}
            </Card>
          </motion.div>
        </div>
        
        <div className="lg:col-span-8 flex flex-col justify-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.1, duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="px-3 py-1 rounded-full border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors uppercase tracking-widest text-xs font-bold">
                {book.category || "Nezaťažené"}
              </Badge>
              <Badge variant={book.availableCopies > 0 ? "secondary" : "destructive"} className="px-3 py-1 rounded-full uppercase tracking-widest text-xs font-bold">
                {book.availableCopies > 0 ? `${book.availableCopies} Na Sklade` : "Vypredané"}
              </Badge>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight text-foreground">{book.title}</h1>
            
            <div className="flex items-center gap-3 text-2xl text-slate-600 dark:text-slate-400 font-medium">
              <span className="text-primary italic">Napisal(a):</span> {book.author || "Neznámy Autor"}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2, duration: 0.5 }}
            className="py-6 border-t border-b border-slate-200/50 dark:border-slate-800/50"
          >
            <h3 className="font-bold text-xl mb-4 text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> O Knihe
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {book.description || "Popis nie je k dispozícii."}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bg-muted/50 rounded-2xl p-4 flex flex-col gap-1 border border-slate-200/50 dark:border-slate-800/50">
              <span className="text-sm font-semibold text-slate-500 uppercase flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> ISBN</span>
              <span className="font-mono text-foreground font-bold">{book.isbn || "N/A"}</span>
            </div>
            <div className="bg-muted/50 rounded-2xl p-4 flex flex-col gap-1 border border-slate-200/50 dark:border-slate-800/50">
              <span className="text-sm font-semibold text-slate-500 uppercase flex items-center gap-1.5"><Library className="h-3.5 w-3.5" /> Žáner</span>
              <span className="text-foreground font-bold">{book.category}</span>
            </div>
            <div className="bg-muted/50 rounded-2xl p-4 flex flex-col gap-1 border border-slate-200/50 dark:border-slate-800/50">
              <span className="text-sm font-semibold text-slate-500 uppercase flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Spisovateľ</span>
              <span className="text-foreground font-bold line-clamp-1">{book.author}</span>
            </div>
            <div className="bg-primary/5 rounded-2xl p-4 flex flex-col gap-1 border border-primary/20">
              <span className="text-sm font-bold text-primary uppercase flex items-center gap-1.5"><Star className="h-3.5 w-3.5" /> Hodnotenie</span>
              <span className="text-primary font-black">Excelentné</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4, duration: 0.5 }}
            className="pt-4 flex flex-col sm:flex-row gap-4"
          >
            {/* Vypožičanie Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              {/* @ts-ignore */}
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className={`h-16 px-10 text-lg rounded-2xl font-bold shadow-xl transition-all ${book.availableCopies > 0 ? "bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-primary/30 hover:-translate-y-1" : "bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed"}`}
                  disabled={book.availableCopies <= 0 || isExecuting}
                >
                  <BookOpen className="mr-3 h-6 w-6" />
                  {book.availableCopies > 0 ? "Ihneď Vypožičať (Zadarmo)" : "Všetky Kusy Vypožičané"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
                <div className="bg-gradient-to-br from-primary/20 to-transparent p-6 pb-4 border-b border-primary/10">
                  <DialogHeader>
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <BookOpen className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <DialogTitle className="text-2xl font-bold text-center">Potvrdenie Výpožičky</DialogTitle>
                    <DialogDescription className="text-center text-slate-500">
                      Skontrolujte detaily pred potvrdením vypožičania.
                    </DialogDescription>
                  </DialogHeader>
                </div>
                
                <div className="p-6 space-y-6 bg-card">
                  {/* Book Summary */}
                  <div className="flex gap-4 items-center bg-muted/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                    {book.coverUrl ? (
                      <div className="relative w-12 h-16">
                        <Image
                          src={book.coverUrl}
                          alt="Obal"
                          fill
                          className="object-cover rounded-md shadow-sm"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-16 bg-slate-200 dark:bg-slate-800 rounded-md flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-bold text-foreground line-clamp-1">{book.title}</h4>
                      <p className="text-sm text-slate-500">{book.author}</p>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 px-1">Údaje čitateľa</h4>
                    {user ? (
                      <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm leading-tight">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-2xl flex items-center gap-3 text-destructive">
                        <AlertCircle className="h-6 w-6" />
                        <div className="text-sm font-medium">
                          Pre vypožičanie sa musíte prihlásiť.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter className="p-6 pt-0 bg-card sm:justify-between items-center gap-4 border-t border-slate-100 dark:border-slate-800/50 mt-auto">
                  <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl w-full sm:w-auto">
                    Zrušiť
                  </Button>
                  <Button 
                    onClick={handleConfirmBorrow} 
                    disabled={isExecuting || !user} 
                    className="rounded-xl px-8 w-full sm:w-auto font-bold shadow-md shadow-primary/20"
                  >
                    {isExecuting ? "Pracujem..." : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Potvrdiť výpožičku
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Link href={`/authors/${mockAuthors.find((a: any) => a.name === book.author)?.id || ''}`}>
              <Button size="lg" variant="outline" className="h-16 w-full sm:w-auto px-8 rounded-2xl text-lg font-bold border-2 hover:bg-muted">
                <User className="mr-2 h-5 w-5" />
                Viac od Autora
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
