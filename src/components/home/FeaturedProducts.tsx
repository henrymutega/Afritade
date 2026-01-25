import { Star, ShieldCheck, Truck, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

const products = [
  {
    id: 1,
    name: "Computer Accessories - chips",
    price: "KES 100",
    unit: "/piece",
    minOrder: "100 pieces",
    supplier: "Shenzhen Tech Co.",
    verified: true,
    rating: 4.8,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Vehicle Spare Parts - Brake Pads",
    price: "KES 2500",
    unit: "/piece",
    minOrder: "5 pieces",
    supplier: "Guangzhou Auto Parts Co.",
    verified: true,
    rating: 4.9,
    reviews: 243,
    image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&h=200&fit=crop",
    badge: "Top Rated",
  },
  {
    id: 3,
    name: "African Print Fabric - Ankara Wax",
    price: "KES 1,200",
    unit: "/yard",
    minOrder: "50 yards",
    supplier: "Weihai Textiles Inc.",
    verified: true,
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=300&h=200&fit=crop",
    badge: null,
  },
  {
    id: 4,
    name: "Solar Panel 400W Monocrystalline",
    price: "KES 35,000",
    unit: "/unit",
    minOrder: "10 units",
    supplier: "SunPower Co Ltd",
    verified: true,
    rating: 4.6,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
    badge: "New",
  },
  {
    id: 5,
    name: "Oppo A54 Smartphone - 128GB, 4GB RAM",
    price: "KES 20,800",
    unit: "/unit",
    minOrder: "10 units",
    supplier: "Oppo Mobile Co. Ltd",
    verified: true,
    rating: 4.8,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1606050627792-8e4c42f2a9c7?w=400&h=300&fit=crop",
    badge: null,
  },
  {
    id: 6,
    name: "Motorcycle Tires - 17 inch",
    price: "KES 1,000",
    unit: "/piece",
    minOrder: "100 pieces",
    supplier: "Wenzhou Tires Co.",
    verified: false,
    rating: 4.5,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    badge: null,
  },
];

export const FeaturedProducts = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t('home.featuredProducts')}
            </h2>
            <p className="text-muted-foreground">
              {t('home.discoverProducts')}
            </p>
          </div>
          <Link to="/products">
            <Button variant="outline" className="hidden md:flex">
              {t('home.viewAllProducts')}
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                    {product.badge}
                  </Badge>
                )}
                {product.verified && (
                  <div className="absolute top-3 right-3 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {t('products.verified')}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-2xl font-bold text-primary">{product.price}</span>
                  <span className="text-muted-foreground text-sm">{product.unit}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>{t('products.minOrder')}: {product.minOrder}</span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3" /> Ships from Kenya
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">{product.supplier}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      <span>{product.rating}</span>
                      <span>({product.reviews} {t('products.reviews')})</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link to="/products">
            <Button variant="outline">{t('home.viewAllProducts')}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
