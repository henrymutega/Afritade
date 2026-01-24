import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const popularSearches = [
  "Phones",
  "Electronics",
  "Computers",
  "Auto Parts",
  "Machinery",
  "Building Materials",
];

export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient opacity-10" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnoiIHN0cm9rZT0iI2Y5NzMxNiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-30" />

      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            China's #1 B2B Marketplace
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Source Products from{" "}
            <span className="text-gradient-primary">China</span>{" "}
            Suppliers
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Connect with verified suppliers and manufacturers across China. 
            Trade in KES with secure payments and logistics.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex bg-card rounded-lg p-2 card-shadow">
              <Input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-base"
              />
              <Button variant="hero" size="lg">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Popular searches */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <span className="text-muted-foreground">Popular:</span>
            {popularSearches.map((search) => (
              <button
                key={search}
                className="px-3 py-1 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {search}
              </button>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <Button variant="cta" size="xl">
              Start Selling <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outlinePrimary" size="xl">
              Request Quotes
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div>
              <p className="font-display text-3xl md:text-4xl font-bold text-primary">50K+</p>
              <p className="text-sm text-muted-foreground">Verified Suppliers</p>
            </div>
            <div>
              <p className="font-display text-3xl md:text-4xl font-bold text-secondary">200K+</p>
              <p className="text-sm text-muted-foreground">Products Listed</p>
            </div>
            <div>
              <p className="font-display text-3xl md:text-4xl font-bold text-accent">7</p>
              <p className="text-sm text-muted-foreground">East African Countries</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
