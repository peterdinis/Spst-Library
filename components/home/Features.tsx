import { FC } from "react";
import {
    BookOpen,
    Search,
    Clock,
    Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Features: FC = () => {
    const features = [
        {
            icon: BookOpen,
            title: "Vast Collection",
            description: "Access thousands of books across all subjects and grade levels"
        },
        {
            icon: Search,
            title: "Easy Discovery",
            description: "Find books by category, author, or subject with our intuitive search"
        },
        {
            icon: Clock,
            title: "24/7 Access",
            description: "Browse and reserve books anytime, anywhere with our digital platform"
        },
        {
            icon: Shield,
            title: "Secure System",
            description: "Safe and secure platform with separate access for teachers and students"
        }
    ];

    return (
        <section>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
                        Why Choose Our Library?
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Our platform combines traditional library values with modern technology to create an exceptional learning experience
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <Card
                                key={feature.title}
                                className="text-center shadow-card hover:shadow-glow transition-smooth border-0 bg-gradient-card hover-float animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <CardHeader>
                                    <div className="mx-auto w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mb-4">
                                        <IconComponent className="h-8 w-8 text-white" />
                                    </div>
                                    <CardTitle>{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>

    )
}

export default Features;