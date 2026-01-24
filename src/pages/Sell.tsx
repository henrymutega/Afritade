import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Globe, TrendingUp, Shield, CheckCircle, ArrowRight,
    Headphones 
} from "lucide-react";

const benefits = [
  {
    icon: Globe,
    title: "Reach Millions of Buyers",
    description: "Access buyers from all 54 African countries and beyond",
  },
  {
    icon: Shield,
    title: "Trade Assurance",
    description: "Secure payments and dispute resolution for peace of mind",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Tools and analytics to help you scale your operations",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated seller support team available around the clock",
  },
];

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description: "Sign up and verify your business details",
  },
  {
    number: "02",
    title: "Set Up Your Store",
    description: "Add your company profile and product catalog",
  },
  {
    number: "03",
    title: "Start Selling",
    description: "Receive inquiries and orders from buyers",
  },
];

const membershipPlans = [
  {
    name: "Basic",
    price: "Free",
    features: [
      "Up to 50 product listings",
      "Basic analytics",
      "Standard support",
      "Buyer inquiries",
    ],
  },
  {
    name: "Gold Supplier",
    price: "KES 25,000/month",
    featured: true,
    features: [
      "Unlimited product listings",
      "Priority search ranking",
      "Advanced analytics",
      "Verified badge",
      "Dedicated account manager",
      "Trade shows access",
    ],
  },
  {
    name: "Premium",
    price: "KES 50,000/month",
    features: [
      "Everything in Gold",
      "Homepage featuring",
      "Custom storefront",
      "API access",
      "Exclusive buyer matching",
    ],
  },
];

const Sell = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero-gradient text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="font-display text-5xl font-bold mb-4">
                Sell on Tre.David
              </h1>
              <p className="text-xl opacity-90 mb-8">
                Join Africa's largest B2B marketplace and reach millions of buyers across the continent and beyond.
              </p>
              <div className="flex gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/register">
                    Start Selling <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">
              Why Sell on Tre.David?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  <div className="text-6xl font-bold text-primary/20 mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-xl text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-primary/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Plans */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-foreground text-center mb-4">
              Membership Plans
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Choose the plan that fits your business needs
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {membershipPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`bg-card rounded-xl border p-6 ${
                    plan.featured
                      ? "border-primary shadow-lg scale-105"
                      : "border-border"
                  }`}
                >
                  {plan.featured && (
                    <div className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                      Most Popular
                    </div>
                  )}
                  <h3 className="font-semibold text-xl text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-2xl font-bold text-primary mb-6">
                    {plan.price}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.featured ? "default" : "outline"}
                    asChild
                  >
                    <Link to="/register">Get Started</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">
              Ready to Grow Your Business?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of African suppliers already selling on AfriTrade
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">
                Start Selling Today <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Sell;
