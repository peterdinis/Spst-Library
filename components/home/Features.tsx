"use client";

import { FC } from "react";
import { BookOpen, Search, Clock, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, Variants, easeOut } from "framer-motion";

const Features: FC = () => {
  const features = [
    { icon: BookOpen, title: "Rozsiahla zbierka", description: "Prístup k tisíckam kníh zo všetkých predmetov a ročníkov" },
    { icon: Search, title: "Jednoduché vyhľadávanie", description: "Nájdite knihy podľa kategórie, autora alebo predmetu pomocou intuitívneho vyhľadávania" },
    { icon: Clock, title: "Prístup 24/7", description: "Prezerajte a rezervujte knihy kedykoľvek a odkiaľkoľvek prostredníctvom našej digitálnej platformy" },
    { icon: Shield, title: "Bezpečný systém", description: "Bezpečná platforma s oddeleným prístupom pre učiteľov a študentov" },
  ];

  // Container animation
  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  // Card animation
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
    hover: { scale: 1.05, y: -5, transition: { duration: 0.3, ease: easeOut } },
  };

  return (
    <section className="bg-background dark:bg-dark-background py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent dark:from-primary/80 dark:to-secondary/80">
            Prečo si vybrať našu knižnicu?
          </h2>
          <p className="text-xl text-muted-foreground dark:text-muted-foreground-dark max-w-2xl mx-auto">
            Naša platforma kombinuje tradičné hodnoty knižnice s modernou technológiou a vytvára tak výnimočný zážitok z učenia
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover="hover"
              >
                <Card className="text-center shadow-card transition-smooth border-0 bg-gradient-card dark:bg-dark-gradient-card hover-float">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-secondary dark:from-primary/80 dark:to-secondary/80 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="h-8 w-8 text-white dark:text-gray-200" />
                    </div>
                    <CardTitle className="dark:text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground dark:text-muted-foreground-dark leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
