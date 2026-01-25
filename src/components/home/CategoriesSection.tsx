import { 
  Cpu, 
  Wheat, 
  Factory, 
  Shirt, 
  Gem, 
  Coffee, 
  HardHat, 
  Car,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const categories = [
  { key: "electronics", icon: Cpu, count: "25,000+", slug: "electronics" },
  { key: "agriculture", icon: Wheat, count: "18,500+", slug: "agriculture" },
  { key: "machinery", icon: Factory, count: "12,000+", slug: "machinery" },
  { key: "textiles", icon: Shirt, count: "30,000+", slug: "textiles" },
  { key: "minerals", icon: Gem, count: "8,500+", slug: "minerals" },
  { key: "foodBeverages", icon: Coffee, count: "22,000+", slug: "food" },
  { key: "construction", icon: HardHat, count: "15,000+", slug: "construction" },
  { key: "autoParts", icon: Car, count: "9,800+", slug: "auto" },
];

export const CategoriesSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('home.topCategories')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('home.exploreCategories')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.key}
              to={`/products?category=${category.slug}`}
              className="group bg-card rounded-xl p-6 text-center card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <category.icon className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                {t(`categories.${category.key}`)}
              </h3>
              <p className="text-xs text-muted-foreground">{category.count} {t('hero.products').toLowerCase()}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
