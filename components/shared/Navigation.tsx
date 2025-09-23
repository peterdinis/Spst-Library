"use client";

import { FC, useState } from "react";
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
import { motion, AnimatePresence } from "framer-motion";

const Navigation: FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { data: user, isAuthenticated } = useProfileWithAuth();
  const [loggedIn, setLoggedIn] = useState(isAuthenticated);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
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
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">
              SPŠT Knižnica
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                href={to}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            {loggedIn && user ? (
              <>
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 hover:scale-105 transition-transform"
                  >
                    <UserCircle className="h-4 w-4" />
                    <span>{user.name}</span>
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:scale-105 transition-transform"
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

          <div className="flex items-center space-x-2 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="transition-transform hover:scale-110"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden"
            >
              <motion.div
                className="py-4 flex flex-col space-y-2"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0, y: -10 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ staggerChildren: 0.05 }}
              >
                {navItems.map(({ to, label, icon: Icon }) => (
                  <motion.div
                    key={to}
                    whileHover={{ x: 5, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Link
                      href={to}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </Link>
                  </motion.div>
                ))}

                <div className="pt-4 border-t space-y-2">
                  {isAuthenticated && user ? (
                    <>
                      <Link href="/profile" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full flex items-center justify-center space-x-1 hover:scale-105 transition-transform"
                        >
                          <UserCircle className="h-4 w-4" />
                          <span>Profil</span>
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center justify-center space-x-1 hover:scale-105 transition-transform"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Odhlásenie</span>
                      </Button>
                    </>
                  ) : (
                    <>
                    <Link href="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="default" size="sm" className="w-full">
                        Prihlásenie / Registrácia
                      </Button>
                    </Link>
                      <div className="mt-6 bg-transparent w-full">
                        <ModeToggle />
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;
