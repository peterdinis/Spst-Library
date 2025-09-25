"use client";

import { FC, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  BookOpen,
  Clock,
  Calendar,
  Award,
  Loader2,
  AlertCircle,
} from "lucide-react";
import ReturnDialog from "../borrow/ReturnDialog";
import { useClerk } from "@clerk/nextjs";
import { useOrdersByUser } from "@/hooks/users/useUserOrders";
import { Order } from "@/types/orderTypes";

const mockStats = {
  totalBorrowed: 47,
  currentlyBorrowed: 3,
  overdue: 0,
};

const ProfileWrapper: FC = () => {
  const { user, loaded, isSignedIn } = useClerk();
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const {data: userOrders, isLoading: userLoading} = useOrdersByUser(Number(user?.id));

  if (!loaded || userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground ml-4">Načítavam váš profil...</p>
      </div>
    );
  }

  if (!isSignedIn || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Nepodarilo sa načítať profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-destructive">Nepodarilo sa načítať váš profil</p>
            <div className="flex space-x-2">
              <Button asChild className="flex-1">
                <a href="/sign-in">Prejsť na prihlásenie</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      {/* Profile Card */}
      <Card className="mb-8 shadow-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">
                {user && user.fullName}
              </CardTitle>
              <CardDescription className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{user && user.emailAddresses[0]?.emailAddress}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Člen od{" "}
                    {new Date(user && user.createdAt!).toLocaleDateString(
                      "sk-SK",
                      {
                        year: "numeric",
                        month: "long",
                      },
                    )}
                  </span>
                </div>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="text-center hover-lift shadow-card">
          <CardContent className="p-4">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">
              {mockStats.currentlyBorrowed}
            </div>
            <div className="text-sm text-muted-foreground">
              Aktuálne požičané
            </div>
          </CardContent>
        </Card>

        <Card className="text-center hover-lift shadow-card">
          <CardContent className="p-4">
            <Award className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {mockStats.totalBorrowed}
            </div>
            <div className="text-sm text-muted-foreground">Prečítané knihy</div>
          </CardContent>
        </Card>

        <Card className="text-center hover-lift shadow-card">
          <CardContent className="p-4">
            <Award className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {mockStats.overdue}
            </div>
            <div className="text-sm text-muted-foreground">
              Požičky po termíne
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Section */}
      <h2 className="text-2xl font-bold mb-6">Aktuálne objednávky</h2>

      {userOrders && userOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userOrders && userOrders.map((order: Order) => (
            <Card key={order.id} className="hover-lift shadow-card">
              <CardHeader className="pb-4 flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    Objednávka #{order.id}
                  </CardTitle>
                  <div className="flex items-center space-x-1 mt-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Badge
                  variant={order.status === "PENDING" ? "secondary" : "default"}
                >
                  {order.status}
                </Badge>
              </CardHeader>

              <CardContent className="pb-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>ID používateľa: {order.userId}</div>
                  <div>
                    Aktualizované:{" "}
                    {new Date(order.updatedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Return button if COMPLETED */}
                {order.status === "COMPLETED" && (
                  <div className="mt-4">
                    <Button
                      onClick={() => {
                        setSelectedOrderId(order.id);
                        setReturnDialogOpen(true);
                      }}
                      variant="destructive"
                      size="sm"
                    >
                      Vrátiť objednávku
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">
            Žiadne aktuálne objednávky
          </h3>
          <p className="text-muted-foreground mb-4">
            Nemáte žiadne aktívne objednávky.
          </p>
        </div>
      )}

      {selectedOrderId && (
        <ReturnDialog
          orderId={selectedOrderId}
          isOpen={returnDialogOpen}
          onClose={() => {
            setSelectedOrderId(null);
            setReturnDialogOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ProfileWrapper;
