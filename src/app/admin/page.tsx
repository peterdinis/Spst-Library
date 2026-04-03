import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Users, Tags, ArrowRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/admin/login");
  }

  const sections = [
    {
      title: "Knihy",
      description: "Pridávajte, upravujte a mažte knihy z vášho katalógu.",
      href: "/admin/books",
      icon: BookOpen,
      color: "bg-indigo-100 text-indigo-600",
      countLabel: "Všetky knihy"
    },
    {
      title: "Autori",
      description: "Spravujte zoznam autorov a ich životopisy.",
      href: "/admin/authors",
      icon: Users,
      color: "bg-amber-100 text-amber-600",
      countLabel: "Všetci autori"
    },
    {
      title: "Kategórie",
      description: "Organizujte knihy do kategórií pre lepšiu prehľadnosť.",
      href: "/admin/categories",
      icon: Tags,
      color: "bg-purple-100 text-purple-600",
      countLabel: "Všetky kategórie"
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Administrácia</h1>
        <p className="text-lg text-slate-500">Vitajte v centre správy SPST Knižnice.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="h-full hover:shadow-2xl transition-all duration-300 border-slate-200/50 group cursor-pointer rounded-3xl overflow-hidden active:scale-[0.98]">
              <CardHeader className="pb-4">
                <div className={`w-14 h-14 rounded-2xl ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <section.icon className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl">{section.title}</CardTitle>
                <CardDescription className="text-base mt-2">{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="flex items-center text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors">
                    Prejsť na správu <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                 </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
