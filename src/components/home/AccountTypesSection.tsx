import { ShoppingBag, Factory, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const AccountTypesSection = () => {
  const { t } = useTranslation();

  const accountTypes = [
    {
      icon: ShoppingBag,
      titleKey: "buyer",
      descKey: "buyerDesc",
      features: [
        "Access to 200,000+ products",
        "Request quotes from suppliers",
        "Trade Assurance protection",
        "M-Pesa & card payments",
      ],
      ctaKey: "createFree",
      color: "primary",
    },
    {
      icon: Factory,
      titleKey: "seller",
      descKey: "sellerDesc",
      features: [
        "List unlimited products",
        "Reach buyers in 54 countries",
        "Get verified seller badge",
        "Instant quote requests",
      ],
      ctaKey: "createFree",
      color: "secondary",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('home.accountTypes')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('home.accountSubtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {accountTypes.map((type, index) => (
            <div
              key={type.titleKey}
              className="relative bg-card rounded-2xl p-8 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-2 animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Decorative gradient */}
              <div 
                className={`absolute top-0 left-0 right-0 h-1 ${
                  type.color === "primary" ? "hero-gradient" : "cta-gradient"
                }`} 
              />

              <div 
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  type.color === "primary" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                }`}
              >
                <type.icon className="w-7 h-7" />
              </div>

              <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                {t(`accounts.${type.titleKey}`)}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t(`accounts.${type.descKey}`)}
              </p>

              <ul className="space-y-3 mb-8">
                {type.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      type.color === "primary" ? "bg-primary" : "bg-secondary"
                    }`} />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/register">
                <Button 
                  className="w-full" 
                  variant={type.color === "primary" ? "hero" : "cta"}
                  size="lg"
                >
                  {t(`accounts.${type.ctaKey}`)} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
