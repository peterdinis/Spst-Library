import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Library, User, ArrowRight } from "lucide-react";

export default async function WelcomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const name = session.user.name || "čitateľ";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="max-w-5xl w-full grid gap-8 lg:grid-cols-[1.2fr,1fr] items-stretch">
        <Card className="rounded-[2.25rem] border-slate-200 shadow-xl bg-white">
          <CardHeader className="pb-2 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600 flex items-center gap-2">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Prihlásenie úspešné
            </p>
            <CardTitle className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Vitaj späť, {name}!
            </CardTitle>
            <CardDescription className="text-base text-slate-500">
              Teraz môžete spravovať svoje výpožičky, objavovať nové knihy a upravovať svoj profil.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 pb-7 space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/my-books">
                <Button className="w-full h-12 rounded-2xl font-semibold flex items-center justify-between px-5">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Moje výpožičky
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/books">
                <Button
                  className="w-full h-12 rounded-2xl font-semibold flex items-center justify-between px-5"
                  variant="outline"
                >
                  <span className="flex items-center gap-2">
                    <Library className="w-4 h-4" />
                    Prejsť do katalógu
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-900 text-slate-50 flex items-center justify-center text-sm font-bold">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">Profil čitateľa</span>
                  <span className="text-xs text-slate-500">
                    Nastavte si preferencie notifikácií a prezrite si históriu.
                  </span>
                </div>
              </div>
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-slate-700">
                  <User className="w-4 h-4" />
                  Otvoriť profil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.25rem] border-slate-200/80 bg-slate-900 text-slate-50 shadow-xl overflow-hidden">
          <CardHeader className="pb-3 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-300 px-3 py-1 text-xs font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Rýchly prehľad účtu
            </div>
            <CardTitle className="text-2xl font-extrabold tracking-tight">
              Pokračujte v čítaní tam, kde ste skončili.
            </CardTitle>
            <CardDescription className="text-slate-400">
              V sekcii „Moje výpožičky“ nájdete knihy, ktoré máte aktuálne požičané, vrátane
              termínov vrátenia.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
              Po prihlásení sa môžete v navigácii hore kedykoľvek prepnúť medzi katalógom, profilom
              a správou výpožičiek.
            </div>
            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <p className="font-semibold text-slate-300">Tipy po prihlásení:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Navštívte „Moje výpožičky“ pre prehľad aktuálnych kníh.</li>
                <li>V profile si nastavte emailové upozornenia na vrátenie.</li>
                <li>Preskúmajte kategórie a objavte nové tituly.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

