import { z } from "zod";
import { ConvexError } from "convex/values";
import { TableNames, Id } from "convex/_generated/dataModel";
import { SystemTableNames } from "convex/server";

export function createSearchableText(data: {
  title?: string;
  author?: string;
  isbn?: string;
  description?: string;
  publisher?: string;
  tags?: string[];
}): string {
  const parts: string[] = [];

  if (data.title) parts.push(data.title);
  if (data.isbn) parts.push(data.isbn);
  if (data.description) parts.push(data.description);
  if (data.publisher) parts.push(data.publisher);
  if (data.tags && data.tags.length > 0) parts.push(...data.tags);
  if (data.author) parts.push(data.author);

  if (parts.length === 0) return "";

  return parts
    .join(" ")
    .toLowerCase()
    .replace(/[^\w\sáčďéěíľĺňóôřŕšťúůýžÁČĎÉĚÍĽĹŇÓÔŘŔŠŤÚŮÝŽ]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function validateWithZod<T>(schema: z.Schema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError;
      const messages = zodError.issues.map(err => 
        `${err.path.join(".")}: ${err.message}`
      ).join(", ");
      throw new ConvexError(`Validačná chyba: ${messages}`);
    }
    
    if (error instanceof Error) {
      throw new ConvexError(error.message);
    }
    
    throw new ConvexError("Neznáma validačná chyba");
  }
}

export function toId<T extends TableNames | SystemTableNames>(value: string): Id<T> {
  return value as Id<T>;
}