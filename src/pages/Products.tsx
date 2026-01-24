import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Shield, MapPin, MessageSquare } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Solar Panels 400W Monocrystalline",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&h=300&fit=crop",
    price: "KES 15,000 - 18,000",
    minOrder: "10 pieces",
    supplier: "GuangZhou Solar Ltd",
    location: "Guangzhou, China",
    rating: 4.8,
    reviews: 156,
    verified: true,
  },
  {
    id: 2,
    name: "Construction Bricks",
    image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&h=200&fit=crop",
    price: "KES 850 - 1,200",
    minOrder: "100 kg",
    supplier: "Henan Building Materials Co.",
    location: "Henan, China",
    rating: 4.9,
    reviews: 342,
    verified: true,
  },
  {
    id: 3,
    name: "Alpha Laptop Pro 15-inch",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop",
    price: "KES 45,000 - 68,000",
    minOrder: "1 unit",
    supplier: "TechMill Industries",
    location: "Shanghai, China",
    rating: 4.7,
    reviews: 89,
    verified: true,
  },
  {
    id: 4,
    name: "Ankara Print Fabric - Bulk",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=300&h=200&fit=crop",
    price: "KES 350 - 500",
    minOrder: "50 yards",
    supplier: "Weihai Co. Textiles",
    location: "Shandong, China",
    rating: 4.6,
    reviews: 234,
    verified: true,
  },
  {
    id: 5,
    name: "Copper Cathodes 99.99%",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    price: "KES 780,000 - 850,000",
    minOrder: "1 ton",
    supplier: "Shenzhen Metals Co.",
    location: "Shenzhen, China",
    rating: 4.9,
    reviews: 67,
    verified: true,
  },
  {
    id: 6,
    name: "Organic Shea Butter - Raw",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=300&fit=crop",
    price: "KES 2,500 - 3,200",
    minOrder: "25 kg",
    supplier: "Fujin Natural Products",
    location: "Fujin, China",
    rating: 4.8,
    reviews: 189,
    verified: true,
  },
];

const Products = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.supplier.toLowerCase().includes(searchLower) ||
        product.location.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const pageTitle = search 
    ? `Search results for "${search}"`
    : category 
      ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products`
      : "All Products";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            {pageTitle}
          </h1>
          <p className="text-muted-foreground text-lg">
            {filteredProducts.length} products from verified African suppliers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-xl font-bold text-primary mb-1">
                  {product.price}
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  Min. Order: {product.minOrder}
                </p>
                
                <div className="flex items-center gap-2 mb-3">
                  {product.verified && (
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-muted-foreground">({product.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="text-sm">
                    <p className="font-medium text-foreground">{product.supplier}</p>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {product.location}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">No products found for your search.</p>
            <Link to="/products" className="text-primary hover:underline mt-2 inline-block">
              View all products
            </Link>
          </div>
        )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
