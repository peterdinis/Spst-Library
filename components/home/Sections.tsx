import { ArrowRight, BookOpen, Link, Users } from "lucide-react";
import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

const Sections: FC = () => {
    return (
        <>
        <section className="py-20 bg-gradient-books">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Featured Books
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover our most popular and recommended books across all subjects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Classic Literature" },
              { title: "Brief History of Time", author: "Stephen Hawking", category: "Science" },
              { title: "Mathematics for Everyone", author: "John Smith", category: "Mathematics" },
              { title: "World History Atlas", author: "National Geographic", category: "History" },
              { title: "Biology Fundamentals", author: "Mary Johnson", category: "Biology" },
              { title: "Creative Writing Guide", author: "Sarah Wilson", category: "Language Arts" },
              { title: "Physics Made Simple", author: "Albert Chen", category: "Physics" },
              { title: "Art Through Ages", author: "Helen Davis", category: "Art" }
            ].map((book, index) => (
              <Card 
                key={book.title} 
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-smooth hover-float animate-slide-up text-white"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-2">
                  <div className="w-full h-32 bg-white/20 rounded-lg mb-4 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-white/70" />
                  </div>
                  <CardTitle className="text-sm font-semibold line-clamp-2">{book.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-white/80 text-sm mb-1">by {book.author}</p>
                  <p className="text-white/60 text-xs">{book.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Browse Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
              Start Exploring
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse our extensive collection organized by categories and discover your favorite authors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="shadow-card hover:shadow-glow transition-smooth border-0 bg-gradient-card hover-float animate-slide-up group">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Book Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Explore books organized by subject areas including Fiction, Science, Mathematics, History, and more.
                </p>
                <Button asChild className="w-full bg-gradient-hero hover:shadow-glow transition-smooth">
                  <Link to="/categories" className="flex items-center justify-center space-x-2">
                    <span>Browse Categories</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-glow transition-smooth border-0 bg-gradient-card hover-float animate-slide-up group">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Featured Authors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Discover works by renowned authors from Shakespeare to Stephen Hawking and beyond.
                </p>
                <Button asChild className="w-full bg-gradient-accent hover:shadow-glow transition-smooth">
                  <Link to="/authors" className="flex items-center justify-center space-x-2">
                    <span>Meet Authors</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
        </>
    )
}

export default Sections;