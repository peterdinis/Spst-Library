"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";
import { useCreateOrder } from "@/hooks/orders/useCreateOrder";
import { useProfile } from "@/hooks/auth/useProfile";

interface BorrowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookTitle: string;
  bookId: number;
  onConfirm: (borrowData: BorrowData) => void;
}

export interface BorrowData {
  name: string;
  lastName: string;
  fromDate: Date;
  toDate: Date;
}

export const BorrowDialog = ({
  open,
  onOpenChange,
  bookTitle,
  onConfirm,
  bookId,
}: BorrowDialogProps) => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const createOrder = useCreateOrder();
  const { data: user } = useProfile();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !lastName || !fromDate || !toDate) {
      toast({
        title: "Vyplňte všetky polia",
        description: "Všetky polia sú povinné pre požičanie knihy.",
        variant: "destructive",
      });
      return;
    }

    if (fromDate >= toDate) {
      toast({
        title: "Neplatný dátum",
        description: "Dátum vrátenia musí byť po dátume požičania.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Nie ste prihlásený",
        description: "Pre požičanie knihy sa musíte prihlásiť.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const newOrder = await createOrder.mutateAsync({
        userId: user.id,
        items: [
          {
            bookId: Number(bookId),
            quantity: 1,
          },
        ],
      });

      toast({
        title: "Kniha požičaná",
        description: `Objednávka #${newOrder.id} bola úspešne vytvorená.`,
        className: "bg-green-800 text-white font-bold text-base",
      });

      onConfirm({
        name,
        lastName,
        fromDate,
        toDate,
      });

      // Reset form
      setName("");
      setLastName("");
      setFromDate(undefined);
      setToDate(undefined);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Chyba pri požičaní knihy",
        description: error?.message || "Skúste to prosím neskôr.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px] bg-card border shadow-elegant z-50">
        <DialogHeader>
          <DialogTitle>Požičať knihu</DialogTitle>
          <DialogDescription>
            Vyplňte svoje údaje pre požičanie knihy "{bookTitle}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Meno</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Zadajte svoje meno"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Priezvisko</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Zadajte svoje priezvisko"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dátum požičania</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fromDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "PPP") : "Vyberte dátum"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-card border shadow-elegant z-50"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Dátum vrátenia</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !toDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "PPP") : "Vyberte dátum"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-card border shadow-elegant z-50"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    disabled={(date) => date < (fromDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Zrušiť
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Požičanie..." : "Potvrdiť požičanie"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
