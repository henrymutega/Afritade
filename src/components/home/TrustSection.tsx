import { ShieldCheck, CreditCard, Truck, Headphones } from "lucide-react";
import { useTranslation } from "react-i18next";

export const TrustSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: ShieldCheck,
      titleKey: "verifiedSuppliers",
      descKey: "verifiedDesc",
    },
    {
      icon: CreditCard,
      titleKey: "securePayments",
      descKey: "secureDesc",
    },
    {
      icon: Truck,
      titleKey: "qualityAssurance",
      descKey: "qualityDesc",
    },
    {
      icon: Headphones,
      titleKey: "support",
      descKey: "supportDesc",
    },
  ];

  return (
    <section className="py-16 hero-gradient text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            {t('home.whyChoose')}
          </h2>
          <p className="opacity-90 max-w-2xl mx-auto">
            {t('home.trustSubtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.titleKey}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t(`trust.${feature.titleKey}`)}</h3>
              <p className="text-sm opacity-80">{t(`trust.${feature.descKey}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
