import { ShieldCheck, CreditCard, Truck, Headphones } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Trade Assurance",
    description: "Protected payments and guaranteed delivery. Your money is safe until you confirm satisfaction.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Pay in KES with M-Pesa, bank transfer, or international cards. Multiple payment options available.",
  },
  {
    icon: Truck,
    title: "Logistics Support",
    description: "Integrated shipping solutions across Africa. Track your orders from factory to doorstep.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated support team to help you source products, resolve disputes, and grow your business.",
  },
];

export const TrustSection = () => {
  return (
    <section className="py-16 hero-gradient text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Trade with Confidence
          </h2>
          <p className="opacity-90 max-w-2xl mx-auto">
            Tre.David protects your business with verified suppliers, secure payments, and guaranteed delivery
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm opacity-80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
