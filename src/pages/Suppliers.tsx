import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Shield, Award, MapPin, MessageSquare } from "lucide-react";

const suppliers = [
  {
    id: 1,
    name: "Shenzhen Solar Tech Co.",
    type: "Manufacturer",
    location: "Shenzhen, China",
    products: ["Solar Panels", "Inverters", "Batteries"],
    rating: 4.8,
    reviews: 156,
    yearsOnPlatform: 5,
    verified: true,
    gold: true,
    image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Electronic Exports Ltd",
    type: "Exporter",
    location: "Shanghai, China",
    products: ["Laptops", "Mobile Phones", "Monitors"],
    rating: 4.9,
    reviews: 342,
    yearsOnPlatform: 8,
    verified: true,
    gold: true,
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=300&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Xiaomi Mobile Co. Ltd",
    type: "Manufacturer",
    location: "Shanghai, China",
    products: ["Smartphones", "Tablets", "Home Appliances"],
    rating: 4.7,
    reviews: 89,
    yearsOnPlatform: 6,
    verified: true,
    gold: false,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop",
  },
  {
    id: 4,
    name: "Weihai Textiles Inc.",
    type: "Manufacturer",
    location: "Weihai, China",
    products: ["Ankara Fabrics", "Kente Cloth", "African Prints"],
    rating: 4.6,
    reviews: 234,
    yearsOnPlatform: 10,
    verified: true,
    gold: true,
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=300&h=200&fit=crop",
  },
  {
    id: 5,
    name: "Fujin Automotive Parts Co.",
    type: "Manufacturer",
    location: "Fujin, China",
    products: ["Motorcycle Parts", "Car Parts", "Engine Components"],
    rating: 4.9,
    reviews: 67,
    yearsOnPlatform: 12,
    verified: true,
    gold: true,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
  },
  {
    id: 6,
    name: "Harbin Agricultural Equipments Co.",
    type: "Exporter",
    location: "Harbin, China",
    products: ["Fertilizers", "Pesticides", "Seeds"],
    rating: 4.8,
    reviews: 189,
    yearsOnPlatform: 7,
    verified: true,
    gold: false,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
  },
];

const Suppliers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Verified Suppliers
          </h1>
          <p className="text-muted-foreground text-lg">
            Connect with trusted manufacturers and exporters across Africa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <Link
              key={supplier.id}
              to={`/supplier/${supplier.id}`}
              className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary hover:shadow-lg transition-all duration-300"
            >
              <div className="h-40 overflow-hidden bg-muted">
                <img
                  src={supplier.image}
                  alt={supplier.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {supplier.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{supplier.type}</p>
                  </div>
                  <div className="flex gap-1">
                    {supplier.verified && (
                      <Badge variant="secondary" className="text-xs">
                        <Shield className="w-3 h-3" />
                      </Badge>
                    )}
                    {supplier.gold && (
                      <Badge className="bg-yellow-500 text-yellow-900 text-xs">
                        <Award className="w-3 h-3" />
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" />
                  {supplier.location}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {supplier.products.slice(0, 3).map((product) => (
                    <Badge key={product} variant="outline" className="text-xs">
                      {product}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{supplier.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {supplier.yearsOnPlatform} years
                    </span>
                  </div>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Suppliers;
