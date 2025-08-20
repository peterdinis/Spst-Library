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
              <span className="text-2xl font-bold">SchoolLibrary</span>
            </div>
            <p className="text-primary-foreground/80 mb-4">
              Empowering education through accessible digital library resources
            </p>
            <div className="flex items-center justify-center space-x-1 text-sm">
              <span>Made with</span>
              <Star className="h-4 w-4 text-secondary fill-current" />
              <span>for students and teachers</span>
            </div>
          </div>
        </div>
      </footer>
        </>
    )
}

export default Footer;