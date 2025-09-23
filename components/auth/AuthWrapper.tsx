"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  BookOpen,
  Mail,
  Lock,
  User,
  GraduationCap,
  Users,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import Link from "next/link";
import { useLogin } from "@/hooks/auth/useLogin";
import { useRegister } from "@/hooks/auth/useRegister";
import { LoginFormInputs, RegisterFormInputs, RoleType } from "./AuthTypes";

const AuthWrapper: FC = () => {
  const { toast } = useToast();
  const navigate = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loginForm = useForm<LoginFormInputs>();
  const registerForm = useForm<RegisterFormInputs>();

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleLogin = (data: LoginFormInputs) => {
    loginMutation.mutate(data, {
      onSuccess: (res: { access_token: string; refresh_token: string }) => {
        localStorage.setItem("token", res.access_token);
        toast({
          title: "Prihlásenie úspešné!",
          description: "Vitaj späť v Školskej knižnici.",
        });
        navigate.push("/profile");
      },
      onError: (err) => {
        toast({
          title: "Chyba",
          description: err.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleRegister = (data: RegisterFormInputs) => {
    if (data.registerPassword !== data.confirmPassword) {
      toast({
        title: "Chyba",
        description: "Heslá sa nezhodujú",
        variant: "destructive",
      });
      return;
    }

    registerMutation.mutate(
      {
        name: data.fullName,
        email: data.registerEmail,
        password: data.registerPassword,
        role: data.role,
      },
      {
        onSuccess: () => {
          toast({
            title: "Účet úspešne vytvorený!",
            description: "Teraz sa môžete prihlásiť do Školskej knižnice.",
          });
          registerForm.reset();
          setActiveTab("login");
        },
        onError: (err) => {
          toast({
            title: "Chyba",
            description: err.message,
            variant: "destructive",
          });
        },
      },
    );
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 md:p-6">
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
          <Tabs
            value={activeTab}
            onValueChange={(value: string) =>
              setActiveTab(value as "login" | "register")
            }
            className="w-full"
          >
            <CardHeader className="space-y-2 pb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Prihlásiť sa</TabsTrigger>
                <TabsTrigger value="register">Registrovať sa</TabsTrigger>
              </TabsList>
            </CardHeader>

            {/* Login Tab */}
            <TabsContent value="login">
              <form
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="space-y-6"
              >
                <CardContent className="space-y-4">
                  <CardTitle className="text-2xl text-center">
                    Vitaj späť
                  </CardTitle>
                  <CardDescription className="text-center">
                    Prihláste sa do svojho účtu Školskej knižnice
                  </CardDescription>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...loginForm.register("email")}
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
                          {...loginForm.register("password")}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Zadajte svoje heslo"
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {loginMutation.isPending ? (
                      <Loader2 className="animate-spin w-6 h-6 mx-auto" />
                    ) : (
                      "Prihlásiť sa"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form
                onSubmit={registerForm.handleSubmit(handleRegister)}
                className="space-y-6"
              >
                <CardContent className="space-y-4">
                  <CardTitle className="text-2xl text-center">
                    Vytvoriť účet
                  </CardTitle>
                  <CardDescription className="text-center">
                    Pridajte sa k Školskej knižnici a začnite si požičiavať
                    knihy
                  </CardDescription>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Celé meno</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...registerForm.register("fullName")}
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
                          {...registerForm.register("registerEmail")}
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
                      <Select
                        onValueChange={(val: string) =>
                          registerForm.setValue("role", val as RoleType)
                        }
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Vyberte svoju rolu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="STUDENT">
                            <div className="flex items-center space-x-2">
                              <GraduationCap className="h-4 w-4" />
                              <span>Študent</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="TEACHER">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>Učiteľ</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registerPassword">Heslo</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...registerForm.register("registerPassword")}
                          id="registerPassword"
                          type={showRegisterPassword ? "text" : "password"}
                          placeholder="Vytvorte si heslo"
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowRegisterPassword(!showRegisterPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showRegisterPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Potvrďte heslo</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...registerForm.register("confirmPassword")}
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Potvrďte svoje heslo"
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {registerMutation.isPending ? (
                      <Loader2 className="animate-spin w-6 h-6 mx-auto" />
                    ) : (
                      "Vytvoriť účet"
                    )}
                  </Button>
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
