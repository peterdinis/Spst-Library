"use client";

import { FC } from "react";
import { useParams } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import { useAuthor } from "@/hooks/authors/useAuthorDetail";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
    },
  },
};

const listVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const AuthorDetail: FC = () => {
  const params = useParams();
  const id = Number(params?.id);

  const { data: author, isLoading, error } = useAuthor(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-[60vh] text-center text-red-500"
      >
        <p className="font-semibold">Nepodarilo sa načítať autora.</p>
        <p className="text-sm text-muted-foreground">
          {(error as Error).message}
        </p>
      </motion.div>
    );
  }

  if (!author) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-[60vh]"
      >
        <p className="text-muted-foreground">Autor neexistuje.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <Link href="/authors">Naspäť na zoznam spisovateľov</Link>
      <Card className="mb-8 shadow-md mt-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">
            {author.name}
          </CardTitle>
          <div className="mt-2 text-muted-foreground text-sm">
            Narodený {author.bornDate}
            {author.deathDate && <> • Zomrel {author.deathDate}</>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-foreground leading-relaxed">{author.bio}</p>

          {author.litPeriod && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Literárne obdobie:</span>
              <Badge variant="secondary">{author.litPeriod}</Badge>
            </div>
          )}

          <div className="flex items-center gap-4 mt-4">
            <Badge variant="outline">
              {author.books.length} diel{author.books.length === 1 ? "o" : "a"}
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl font-semibold mb-4"
      >
        Knihy autora
      </motion.h2>

      {author.books.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground"
        >
          Tento autor zatiaľ nemá žiadne knihy.
        </motion.p>
      ) : (
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {author.books.map((book) => (
            <motion.div key={book.id} variants={itemVariants}>
              <Card className="hover:shadow-lg transition-shadow hover:scale-[1.02] duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <BookOpen className="w-5 h-5 text-primary" />
                    {book.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {book.description || "Bez popisu"}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge
                      variant={book.isAvailable ? "default" : "secondary"}
                      className={
                        book.isAvailable ? "bg-green-500/20 text-green-700" : ""
                      }
                    >
                      {book.isAvailable ? "Dostupná" : "Nedostupná"}
                    </Badge>
                    <Link href={`/books/${book.id}`}>
                      <Button variant="outline" size="sm">
                        Detail
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AuthorDetail;
