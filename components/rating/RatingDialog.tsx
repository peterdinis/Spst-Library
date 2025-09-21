"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

export interface RatingData {
  value: number;
  comment?: string;
}

interface RatingDialogProps {
  bookId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: RatingData) => void;
}

export function RatingDialog({
  open,
  onOpenChange,
  onConfirm,
}: RatingDialogProps) {
  const [value, setValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(0);
  const [comment, setComment] = useState("");

  const handleConfirm = () => {
    if (value === 0) return;
    onConfirm({ value, comment });
    setValue(0);
    setHoverValue(0);
    setComment("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pridať hodnotenie</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="flex items-center space-x-2">
            <Label>Hodnotenie:</Label>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-6 w-6 cursor-pointer ${
                  (hoverValue || value) >= star
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
                onClick={() => setValue(star)}
                onMouseEnter={() => setHoverValue(star)}
                onMouseLeave={() => setHoverValue(0)}
              />
            ))}
          </div>

          <div className="flex flex-col">
            <Label>Komentár (voliteľné):</Label>
            <Textarea
              className="mt-2"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Napíšte svoj komentár..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleConfirm}
            className="w-full"
            disabled={value === 0}
          >
            Odoslať
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
