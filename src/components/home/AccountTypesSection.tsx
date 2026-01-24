import { ShoppingBag, Factory, Warehouse, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const accountTypes = [
  {
    icon: ShoppingBag,
    title: "Buyer Account",
    description: "Source products from verified China suppliers. Get competitive prices and trade protection.",
    features: [
      "Access to 200,000+ products",
      "Request quotes from suppliers",
      "Trade Assurance protection",
      "M-Pesa & card payments",
    ],
    cta: "Start Buying",
    color: "primary",
  },
  {
    icon: Factory,
    title: "Manufacturer Account",
    description: "Showcase your products to global buyers. Grow your manufacturing business with Tre.David.",
    features: [
      "List unlimited products",
      "Reach buyers in 7 countries",
      "Get verified manufacturer badge",
      "Instant quote requests",
    ],
    cta: "Start Manufacturing",
    color: "secondary",
  },
  {
    icon: Warehouse,
    title: "Supplier Account",
    description: "Distribute products across Africa. Connect with retailers and businesses looking to buy.",
    features: [
      "Wholesale & bulk orders",
      "Multi-category listings",
      "Business analytics dashboard",
      "Priority customer support",
    ],
    cta: "Start Supplying",
    color: "accent",
  },
];

export const AccountTypesSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Account Type
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you're buying, manufacturing or supplying, Tre.David has the right tools for your business
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {accountTypes.map((type, index) => (
            <div
              key={type.title}
              className="relative bg-card rounded-2xl p-8 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-2 animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Decorative gradient */}
              <div 
                className={`absolute top-0 left-0 right-0 h-1 ${
                  type.color === "primary" ? "hero-gradient" : 
                  type.color === "secondary" ? "cta-gradient" : "gold-gradient"
                }`} 
              />

              <div 
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  type.color === "primary" ? "bg-primary/10 text-primary" : 
                  type.color === "secondary" ? "bg-secondary/10 text-secondary" : "bg-accent/20 text-accent-foreground"
                }`}
              >
                <type.icon className="w-7 h-7" />
              </div>

              <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                {type.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {type.description}
              </p>

              <ul className="space-y-3 mb-8">
                {type.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      type.color === "primary" ? "bg-primary" : 
                      type.color === "secondary" ? "bg-secondary" : "bg-accent"
                    }`} />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className="w-full" 
                variant={type.color === "primary" ? "hero" : type.color === "secondary" ? "cta" : "gold"}
                size="lg"
              >
                {type.cta} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
