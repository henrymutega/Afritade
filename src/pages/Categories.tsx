import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { 
  Cpu, Factory, Leaf, Shirt, Mountain, Coffee, Building2, Car,
  ArrowRight
} from "lucide-react";

const categories = [
  { name: "Electronics", icon: Cpu, count: "2.5M+ products", href: "/products?category=electronics" },
  { name: "Machinery", icon: Factory, count: "1.8M+ products", href: "/products?category=machinery" },
  { name: "Agriculture", icon: Leaf, count: "3.2M+ products", href: "/products?category=agriculture" },
  { name: "Textiles", icon: Shirt, count: "4.1M+ products", href: "/products?category=textiles" },
  { name: "Minerals", icon: Mountain, count: "890K+ products", href: "/products?category=minerals" },
  { name: "Food & Beverages", icon: Coffee, count: "2.1M+ products", href: "/products?category=food" },
  { name: "Construction", icon: Building2, count: "1.5M+ products", href: "/products?category=construction" },
  { name: "Auto Parts", icon: Car, count: "980K+ products", href: "/products?category=auto" },
];

const Categories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Browse Categories
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore millions of products across China's top industries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.href}
              className="group bg-card rounded-xl p-6 border border-border hover:border-primary hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <category.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {category.count}
              </p>
              <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Browse <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
