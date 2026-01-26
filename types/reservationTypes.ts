import { z } from "zod";

// Schema pre rezervačné dáta
export const ReservationSchema = z.object({
  name: z.string()
    .min(2, "Meno musí mať aspoň 2 znaky")
    .max(100, "Meno je príliš dlhé")
    .regex(/^[a-zA-Zá-žÁ-Ž\s]+$/, "Meno môže obsahovať iba písmená a medzery"),
  email: z.string()
    .email("Neplatný email formát")
    .max(100, "Email je príliš dlhý"),
  phone: z.string()
    .max(20, "Telefónne číslo je príliš dlhé")
    .regex(/^[\d\s+\-()]+$/, "Neplatný telefónny formát")
    .optional()
    .or(z.literal("")),
  note: z.string()
    .max(500, "Poznámka je príliš dlhá")
    .optional()
    .or(z.literal("")),
  period: z.string()
    .refine(val => ["1", "3", "7", "14", "21", "30"].includes(val), {
      message: "Neplatná doba výpožičky"
    }),
  customPeriod: z.string()
    .optional()
});

export type ReservationData = z.infer<typeof ReservationSchema>;

// Book interface podľa vašej existujúcej BookSchema
export interface Book {
  _id: string;
  title: string;
  author: {
    name: string;
    bookCount: number;
  };
  description?: string;
  publishedYear?: number;
  publisher?: string;
  pages?: number;
  language?: string;
  isbn?: string;
  category: {
    name: string;
    bookCount: number;
  };
  tags?: string[];
  location?: string;
  status: 'available' | 'reserved' | 'maintenance' | 'lost';
  totalCopies: number;
  availableCopies: number;
  addedAt: string;
  coverFileId?: string;
  coverFile?: {
    url: string;
  };
}