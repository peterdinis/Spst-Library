"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Mail, Lock, User, GraduationCap, Users, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import Link from "next/link";

const AuthWrapper: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Prihlásenie úspešné!",
        description: "Vitaj späť v Školskej knižnici.",
      });
      navigate.push("/");
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Účet úspešne vytvorený!",
        description: "Vitajte v Školskej knižnici. Teraz môžete požičiavať knihy.",
      });
      navigate.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-scale-in space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-white hover:opacity-80 transition-smooth"
          >
            <BookOpen className="h-10 w-10" />
            <span className="text-2xl font-bold">Školská knižnica</span>
          </Link>
          <p className="text-white/80">Vaša brána k poznaniu</p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-elegant">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader className="space-y-2 pb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Prihlásiť sa</TabsTrigger>
                <TabsTrigger value="register">Registrovať sa</TabsTrigger>
              </TabsList>
            </CardHeader>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6">
                <CardContent className="space-y-4">
                  <CardTitle className="text-2xl text-center">Vitaj späť</CardTitle>
                  <CardDescription className="text-center">
                    Prihláste sa do svojho účtu Školskej knižnice
                  </CardDescription>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Zadajte svoj email"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Heslo</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Zadajte svoje heslo"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Prihlasovanie..." : "Prihlásiť sa"}
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    Demo údaje: akýkoľvek email/heslo bude fungovať
                  </p>
                </CardFooter>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-6">
                <CardContent className="space-y-4">
                  <CardTitle className="text-2xl text-center">Vytvoriť účet</CardTitle>
                  <CardDescription className="text-center">
                    Pridajte sa k Školskej knižnici a začnite si požičiavať knihy
                  </CardDescription>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Celé meno</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Zadajte svoje celé meno"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registerEmail">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="registerEmail"
                          type="email"
                          placeholder="Zadajte svoj email"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Rola</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Vyberte svoju rolu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student" className="flex items-center space-x-2">
                            <GraduationCap className="h-4 w-4" />
                            <span>Študent</span>
                          </SelectItem>
                          <SelectItem value="teacher" className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>Učiteľ</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registerPassword">Heslo</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="registerPassword"
                          type="password"
                          placeholder="Vytvorte si heslo"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Potvrďte heslo</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Potvrďte svoje heslo"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin w-8 h-8" /> : "Vytvoriť účet"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Vytvorením účtu súhlasíte s našimi Podmienkami používania a Zásadami ochrany osobných údajov
                  </p>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-white/80 hover:text-white text-sm transition-smooth"
          >
            ← Späť do Školskej knižnice
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthWrapper;
