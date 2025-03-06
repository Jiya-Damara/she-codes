
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/feature-card";
import { Users, MessageSquare, CalendarIcon, BookOpen, Bell, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const features = [
    {
      icon: <Users className="h-7 w-7 text-brand" />,
      title: "Anonymous Health Discussions",
      description: "A secure, women-only community where users can discuss PCOS, cancer, menstrual health, and more without fear of judgment."
    },
    {
      icon: <MessageSquare className="h-7 w-7 text-brand" />,
      title: "Smart Chatbox",
      description: "A smart assistant trained in women's health, mental well-being, and myth-busting, providing instant, science-backed guidance."
    },
    {
      icon: <CalendarIcon className="h-7 w-7 text-brand" />,
      title: "Cycle & Wellness Tracker",
      description: "An easy-to-use menstrual and symptom tracker that offers personalized insights and self-care tips."
    },
    {
      icon: <BookOpen className="h-7 w-7 text-brand" />,
      title: "Empowering Articles & Posts",
      description: "A curated collection of blogs, stories, and expert insights written by and for women."
    },
    {
      icon: <Bell className="h-7 w-7 text-brand" />,
      title: "'Her Voice' Self-Care Messages",
      description: "A unique personal motivation system that allows users to set up scheduled voice/text messages for self-care."
    },
    {
      icon: <Heart className="h-7 w-7 text-brand" />,
      title: "Holistic Wellness Resources",
      description: "Access to resources covering physical health, mental wellness, nutrition, and self-defense tips."
    }
  ];

  return (
    <AppLayout>
      <section className="py-12 px-4 md:py-24 bg-gradient-to-br from-white to-brand-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 slideRight">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                <span className="text-brand">सखी</span> Junction
              </h1>
              <p className="text-xl text-muted-foreground">
                A safe, community-driven platform designed to amplify women's voices, 
                foster healing, and deliver holistic wellness solutions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/community">
                  <Button className="bg-brand hover:bg-brand-600 text-white">
                    Join Our Community
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline">Learn More</Button>
                </Link>
                
              </div>
            </div>
            <div className="hidden md:block fadeIn">
              <div className="w-full aspect-square bg-muted rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="/placeholder.svg" 
                  alt="Sakhi Junction" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 staggered">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
