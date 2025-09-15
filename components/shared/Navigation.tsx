"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  Bookmark,
  User,
  LogOut,
  Menu,
  X,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { useProfileWithAuth } from "@/hooks/auth/useProfile";

const Navigation = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { data: user, isAuthenticated } = useProfileWithAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth");
  };

  const navItems = [
    { to: "/", label: "Domov", icon: BookOpen },
    { to: "/books", label: "Knihy", icon: Bookmark },
    { to: "/categories", label: "Kategórie", icon: Users },
    { to: "/authors", label: "Spisovatelia", icon: User },
  ];

  return (
    <nav className="bg-card border-b shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">
              SPŠT Knižnica
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                href={to}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-smooth hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <UserCircle className="h-4 w-4" />
                    <span>{user.name}</span>
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Odhlásenie</span>
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button variant="default" size="sm">
                  Prihlásenie / Registrácia
                </Button>
              </Link>
            )}
            <ModeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navItems.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  href={to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}
              <div className="pt-4 border-t space-y-2">
                {isAuthenticated && user ? (
                  <>
                    <Link href="/profile" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full flex items-center justify-center space-x-1"
                      >
                        <UserCircle className="h-4 w-4" />
                        <span>Profile</span>
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-center space-x-1"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Odhlásenie</span>
                    </Button>
                  </>
                ) : (
                  <Link href="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="default" size="sm" className="w-full">
                      Prihlásenie / Registrácia
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
