import Image from "next/image";
import { mockAuthors, mockBooks } from "@/lib/mockData";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AuthorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const author = mockAuthors.find((a) => a.id === id);
  if (!author) notFound();

  // Find all books by this author
  const authorBooks = mockBooks.filter((b) => b.author === author.name);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      <Link href="/authors">
        <Button variant="ghost" className="mb-4 rounded-full pl-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Späť na Autorov
        </Button>
      </Link>

      <Card className="bg-card/40 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 overflow-hidden rounded-[2.5rem] shadow-2xl relative">
        <div className="absolute top-0 w-full h-40 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent z-0" />
        <CardContent className="pt-20 px-8 sm:px-12 pb-12 relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          <div className="h-40 w-40 rounded-[2rem] bg-background shadow-xl flex items-center justify-center border-4 border-white dark:border-slate-900 shrink-0">
            <User className="h-20 w-20 text-primary/60" />
          </div>
          <div className="space-y-4 flex-1">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">{author.name}</h1>
            <div className="h-1 w-20 bg-primary/40 rounded-full mx-auto md:mx-0" />
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {author.bio || "Životopis pre tohto autora momentálne nie je k dispozícii."}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">Knihy od autora</h2>
        </div>

        {authorBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorBooks.map((book) => (
              <Link href={`/books/${book.id}`} key={book.id}>
                <Card className="h-full bg-card/60 backdrop-blur-md hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:border-primary/50 group rounded-2xl overflow-hidden flex flex-row">
                  {book.coverUrl && (
                    <div className="w-1/3 aspect-[3/4] relative overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0">
                      <Image
                        src={book.coverUrl}
                        alt={book.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4 flex-1 flex flex-col justify-center">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">{book.title}</CardTitle>
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary/80 mt-2">{book.category}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold">Zatiaľ žiadne knihy</h3>
            <p className="text-slate-500 mt-2">V našej databáze sa od tohto autora nenachádzajú žiadne diela.</p>
          </div>
        )}
      </div>
    </div>
  );
}
