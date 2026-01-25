import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const CTASection = () => {
  const { t } = useTranslation();

  const benefits = [
    "Free to join - no setup fees",
    "Reach buyers across 54 African countries",
    "Trade Assurance on every transaction",
    "Dedicated account manager",
  ];

  return (
    <section className="py-20 bg-foreground text-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('home.ctaSubtitle')}
          </p>
          
          <ul className="flex flex-wrap justify-center gap-4 mb-8">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <Link to="/register">
            <Button variant="hero" size="xl">
              {t('home.getStarted')} <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
