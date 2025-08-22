"use client";

import { ArrowRight, BookOpen, Users } from "lucide-react";
import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { motion, easeOut } from "framer-motion";

const Sections: FC = () => {
  const books = [
    { title: "Veľký Gatsby", author: "F. Scott Fitzgerald", category: "Klasická literatúra" },
    { title: "Stručná história času", author: "Stephen Hawking", category: "Veda" },
    { title: "Matematika pre každého", author: "John Smith", category: "Matematika" },
    { title: "Atlas svetových dejín", author: "National Geographic", category: "Dejiny" },
    { title: "Základy biológie", author: "Mary Johnson", category: "Biológia" },
    { title: "Sprievodca kreatívnym písaním", author: "Sarah Wilson", category: "Jazykové umenie" },
    { title: "Fyzika jednoducho", author: "Albert Chen", category: "Fyzika" },
    { title: "Umenie cez veky", author: "Helen Davis", category: "Umenie" },
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
  };

  return (
    <>
      {/* Sekcia Odporúčané Knihy */}
      <section className="py-20 bg-background dark:bg-dark-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-primary dark:text-primary/80">
              Odporúčané Knihy
            </h2>
            <p className="text-xl text-muted-foreground dark:text-muted-foreground-dark max-w-2xl mx-auto">
              Objavte naše najpopulárnejšie a odporúčané knihy naprieč všetkými predmetmi
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {books.map((book, index) => (
              <motion.div key={book.title} variants={cardVariants}>
                <Card
                  className="bg-gradient-card dark:bg-dark-gradient-card border-0 hover:shadow-glow hover-float transition-smooth text-primary dark:text-white"
                >
                  <CardHeader className="pb-2">
                    <div className="w-full h-32 bg-gradient-hero dark:bg-gradient-hero-dark rounded-lg mb-4 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-white dark:text-gray-200" />
                    </div>
                    <CardTitle className="text-sm font-semibold line-clamp-2">{book.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-primary/80 dark:text-gray-300 text-sm mb-1">Autor: {book.author}</p>
                    <p className="text-primary/60 dark:text-gray-400 text-xs">{book.category}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Sekcia Prehliadania */}
      <section className="py-20 bg-background dark:bg-dark-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent dark:from-primary/80 dark:to-secondary/80">
              Začnite Objavovať
            </h2>
            <p className="text-xl text-muted-foreground dark:text-muted-foreground-dark max-w-2xl mx-auto">
              Prezrite si našu rozsiahlu zbierku organizovanú podľa kategórií a objavte svojich obľúbených autorov
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Kategórie Kníh */}
            <motion.div variants={cardVariants}>
              <Card className="shadow-card dark:shadow-none hover:shadow-glow transition-smooth border-0 bg-gradient-card dark:bg-dark-gradient-card hover-float">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-gradient-hero dark:bg-gradient-hero-dark rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl dark:text-white">Kategórie Kníh</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground dark:text-muted-foreground-dark mb-6 leading-relaxed">
                    Preskúmajte knihy organizované podľa oblastí, vrátane Beletrie, Vedy, Matematiky, Dejín a ďalších.
                  </p>
                  <Button asChild className="w-full bg-gradient-hero dark:bg-gradient-hero-dark hover:shadow-glow transition-smooth">
                    <a href="/categories" className="flex items-center justify-center space-x-2">
                      <span>Prezrieť Kategórie</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Odporúčaní Autori */}
            <motion.div variants={cardVariants}>
              <Card className="shadow-card dark:shadow-none hover:shadow-glow transition-smooth border-0 bg-gradient-accent dark:bg-gradient-accent-dark hover-float">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-gradient-accent dark:bg-gradient-accent-dark rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl dark:text-white">Odporúčaní Autori</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground dark:text-muted-foreground-dark mb-6 leading-relaxed">
                    Objavte diela renomovaných autorov od Shakespeara po Stephena Hawkinga a ďalších.
                  </p>
                  <Button asChild className="w-full bg-gradient-accent dark:bg-gradient-accent-dark hover:shadow-glow transition-smooth">
                    <a href="/authors" className="flex items-center justify-center space-x-2">
                      <span>Spoznať Autorov</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Sections;
