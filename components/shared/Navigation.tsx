import { BookOpen, Users, Library, Home, Book } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const Navigation: React.FC = () => {
    return (
        <nav className="bg-card shadow-card border-b transition-smooth">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center space-x-2 hover-float">
                        <Library className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-zinc-900">
                            Školská knižnica
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/"
                            className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-smooth`}
                        >
                            <Home className="h-4 w-4" />
                            <span>Domov</span>
                        </Link>

                        <Link
                            href={"/categories"}
                            className="flex items-center space-x-1 px-3 py-2 rounded-md transition-smooth">
                            <Book className="h-4 w-4" />
                            <span>Knihy</span>
                        </Link>

                        <Link
                            href={"/categories"}
                            className="flex items-center space-x-1 px-3 py-2 rounded-md transition-smooth">
                            <BookOpen className="h-4 w-4" />
                            <span>Kategórie</span>
                        </Link>

                        <Link
                            href={"/authors"}
                            className="flex items-center space-x-1 px-3 py-2 rounded-md transition-smooth">
                            <Users className="h-4 w-4" />
                            <span>Spisovatelia</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Button variant="default" asChild>
                            <Link href="/login/student">Student Login</Link>
                        </Button>
                        <Button asChild variant={"secondary"}>
                            <Link href="/login/teacher">Teacher Login</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navigation;