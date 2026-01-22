import { ShieldCheck, Star, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const suppliers = [
  {
    id: 1,
    name: "Kenya Fresh Farms Ltd",
    type: "Manufacturer",
    location: "Nairobi, Kenya",
    products: ["Avocados", "Mangoes", "Passion Fruit"],
    rating: 4.9,
    years: 8,
    verified: true,
    gold: true,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "SunPower Africa",
    type: "Manufacturer",
    location: "Mombasa, Kenya",
    products: ["Solar Panels", "Inverters", "Batteries"],
    rating: 4.8,
    years: 5,
    verified: true,
    gold: false,
    image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Nairobi Textiles Ltd",
    type: "Supplier",
    location: "Nairobi, Kenya",
    products: ["African Prints", "Cotton Fabric", "Kitenge"],
    rating: 4.7,
    years: 12,
    verified: true,
    gold: true,
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=200&h=200&fit=crop",
  },
  {
    id: 4,
    name: "Highland Coffee Co.",
    type: "Manufacturer",
    location: "Nyeri, Kenya",
    products: ["Coffee Beans", "Ground Coffee", "Instant Coffee"],
    rating: 4.9,
    years: 15,
    verified: true,
    gold: true,
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=200&h=200&fit=crop",
  },
];

export const SuppliersSection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Top Suppliers
            </h2>
            <p className="text-muted-foreground">
              Connect with verified manufacturers and suppliers across Africa
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            Browse All Suppliers
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {suppliers.map((supplier, index) => (
            <div
              key={supplier.id}
              className="bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={supplier.image}
                  alt={supplier.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {supplier.gold && (
                      <Badge className="gold-gradient text-accent-foreground text-xs px-1.5 py-0">
                        Gold
                      </Badge>
                    )}
                    {supplier.verified && (
                      <ShieldCheck className="w-4 h-4 text-secondary" />
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground truncate">{supplier.name}</h3>
                  <p className="text-xs text-primary font-medium">{supplier.type}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{supplier.location}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="font-medium">{supplier.rating}</span>
                  <span className="text-muted-foreground">• {supplier.years} years</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {supplier.products.slice(0, 3).map((product) => (
                    <span
                      key={product}
                      className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4" size="sm">
                View Profile <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button variant="outline">Browse All Suppliers</Button>
        </div>
      </div>
    </section>
  );
};
