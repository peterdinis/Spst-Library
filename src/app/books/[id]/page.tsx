import { mockBooks } from "@/lib/mockData";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { BookDetailsClient } from "@/components/BookDetailsClient";

export default async function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const book = mockBooks.find((b) => b.id === id);

  if (!book) {
    notFound();
  }

  // Získame aktuálnu používateľskú reláciu na serveri
  const session = await auth();

  return (
    <BookDetailsClient book={book} user={session?.user} />
  );
}
