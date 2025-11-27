import Link from "next/link";
import { FC } from "react";
import { Button } from "../ui/button";
import { ArrowRight, BookOpen, Search, Users } from "lucide-react";

const Hero: FC = () => {
    return (
        <section className="min-h-screen flex flex-col">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 z-0"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
                    </div>

                    <div className="container mx-auto px-4 z-10 text-center animate-fade-in">
                        <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
                            Vitajte v školskej knižnici
                        </h1>
                        <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                            Objavte svet kníh, rozšírte svoje obzory a požičajte si knihy online.
                            Tisíce titulov čakajú len na vás.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/books">
                                <Button size="lg" variant="secondary" className="group">
                                    Prehliadať knihy
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                                    Prihlásenie
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center p-6 animate-slide-up">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                                    <BookOpen className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Široká ponuka</h3>
                                <p className="text-muted-foreground">
                                    Tisíce kníh zo všetkých žánrov a kategórií pre každého čitateľa.
                                </p>
                            </div>

                            <div className="text-center p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                                    <Search className="h-8 w-8 text-accent-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Jednoduché vyhľadávanie</h3>
                                <p className="text-muted-foreground">
                                    Nájdite svoje obľúbené knihy pomocou pokročilých filtrov a kategórií.
                                </p>
                            </div>

                            <div className="text-center p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                                    <Users className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Pre celú školu</h3>
                                <p className="text-muted-foreground">
                                    Prístup pre všetkých študentov a učiteľov našej školy zadarmo.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Books Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Odporúčané knihy</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Pozrite si naše najnovšie a najpopulárnejšie tituly vybrané špeciálne pre vás
                            </p>
                        </div>

                        <div className="text-center">
                            <Link href="/books">
                                <Button variant="outline" size="lg" className="group">
                                    Zobraziť všetky knihy
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </section>
    )
}

export default Hero;