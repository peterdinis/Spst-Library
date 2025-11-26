"use client";

import { FC, useState } from "react";
import { BookOpen, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation: FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { to: "/", label: "Domov" },
    { to: "/books", label: "Knihy" },
    { to: "/categories", label: "Kategórie" },
    { to: "/authors", label: "Spisovatelia" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 transition-transform hover:scale-105"
          >
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">
              Školská knižnica
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary hover:underline underline-offset-4 decoration-2
                  ${
                    pathname === link.to
                      ? "text-primary underline decoration-2 underline-offset-4"
                      : "text-foreground/80"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}

            <Link href="/login">
              <Button variant="default" size="sm" className="ml-4">
                Prihlásenie
              </Button>
            </Link>
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
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300 
            ${isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <nav className="py-4 border-t border-border/40">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    text-sm font-medium transition-colors py-2
                    ${
                      pathname === link.to
                        ? "text-primary underline decoration-2 underline-offset-4"
                        : "text-foreground/80 hover:text-primary"
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}

              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="default" size="sm" className="w-full mt-1">
                  Prihlásenie
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
