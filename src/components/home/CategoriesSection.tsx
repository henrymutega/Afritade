import { 
  Cpu, 
  Wheat, 
  Factory, 
  Shirt, 
  Gem, 
  Coffee, 
  HardHat, 
  Car,
  Zap,
  Stethoscope,
  Package,
  Palette
} from "lucide-react";

const categories = [
  { name: "Electronics", icon: Cpu, count: "25,000+" },
  { name: "Agriculture", icon: Wheat, count: "18,500+" },
  { name: "Machinery", icon: Factory, count: "12,000+" },
  { name: "Textiles & Apparel", icon: Shirt, count: "30,000+" },
  { name: "Minerals & Metals", icon: Gem, count: "8,500+" },
  { name: "Food & Beverages", icon: Coffee, count: "22,000+" },
  { name: "Construction", icon: HardHat, count: "15,000+" },
  { name: "Auto Parts", icon: Car, count: "9,800+" },
  { name: "Energy & Power", icon: Zap, count: "5,200+" },
  { name: "Health & Medical", icon: Stethoscope, count: "7,500+" },
  { name: "Packaging", icon: Package, count: "11,000+" },
  { name: "Arts & Crafts", icon: Palette, count: "14,000+" },
];

export const CategoriesSection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore Categories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse millions of products across all major African industries
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <a
              key={category.name}
              href="#"
              className="group bg-card rounded-xl p-6 text-center card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <category.icon className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-muted-foreground">{category.count} products</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
