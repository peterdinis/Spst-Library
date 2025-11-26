"use client";

import { FC, useState, useTransition } from "react";
import { BookOpen, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {motion, AnimatePresence} from "framer-motion"
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "./ModeToggle";

const Navigation: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { to: "/", label: "Domov" },
    { to: "/books", label: "Knihy" },
    { to: "/categories", label: "Kategórie" },
    { to: "/authors", label: "Spisovatelia" },
  ];

  const handleNavigation = (href: string) => {
    // Check if browser supports View Transitions API
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        startTransition(() => {
          router.push(href);
          setIsMenuOpen(false);
        });
      });
    } else {
      // Fallback for browsers without View Transitions support
      startTransition(() => {
        router.push(href);
        setIsMenuOpen(false);
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <motion.div
            onClick={() => handleNavigation("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">
              Školská knižnica
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, index) => (
              <motion.button
                key={link.to}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation(link.to)}
                className={`text-sm font-medium transition-colors hover:text-primary relative
                  ${
                    pathname === link.to
                      ? "text-primary"
                      : "text-foreground/80"
                  }
                  ${isPending ? "opacity-50 pointer-events-none" : ""}
                `}
              >
                {link.label}
                {pathname === link.to && (
                  <motion.div
                    layoutId="activeLink"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}

            <Button
              variant="default"
              size="sm"
              className="ml-4"
              onClick={() => handleNavigation("/login")}
              disabled={isPending}
            >
              Prihlásenie
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <nav className="py-4 border-t border-border/40">
                <div className="flex flex-col space-y-3">
                  {navLinks.map((link, index) => (
                    <motion.button
                      key={link.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleNavigation(link.to)}
                      className={`
                        text-sm font-medium transition-colors py-2 text-left
                        ${
                          pathname === link.to
                            ? "text-primary underline decoration-2 underline-offset-4"
                            : "text-foreground/80 hover:text-primary"
                        }
                        ${isPending ? "opacity-50 pointer-events-none" : ""}
                      `}
                    >
                      {link.label}
                    </motion.button>
                  ))}

                  <ModeToggle />
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.1 }}
                  >
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full mt-1"
                      onClick={() => handleNavigation("/login")}
                      disabled={isPending}
                    >
                      Prihlásenie
                    </Button>
                  </motion.div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navigation;