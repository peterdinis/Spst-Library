import { BookOpen, Star } from "lucide-react";
import { FC } from "react";

const Footer: FC = () => {
    return (
        <>
        <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-secondary" />
              <span className="text-2xl font-bold">SPŠT Knižnica</span>
            </div>
            <p className="text-primary-foreground/80 mb-4">
              Posilňujeme vzdelávanie prostredníctvom dostupných digitálnych knižničných zdrojov
            </p>
            <div className="flex items-center justify-center space-x-1 text-sm">
              <span>Vyrobené s</span>
              <Star className="h-4 w-4 text-secondary fill-current" />
              <span>pre študentov a učiteľov</span>
            </div>
          </div>
        </div>
      </footer>
        </>
    )
}

export default Footer;
