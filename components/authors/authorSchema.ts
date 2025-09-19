import z from "zod";

export const schema = z.object({
  name: z.string().min(1, "Meno je povinné"),
  litPeriod: z.string().min(1, "Literárne obdobie je povinné"),
  bornDate: z.string().min(1, "Dátum narodenia je povinný"),
  deathDate: z.string().optional(),
  bio: z.string().optional(),
  authorImage: z.string().optional(),
  suggestedByName: z.string().optional(),
});

export type FormValues = z.infer<typeof schema>;