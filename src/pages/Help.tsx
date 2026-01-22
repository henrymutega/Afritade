import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Search, MessageSquare, ShoppingCart, Truck, Shield, 
  CreditCard, Users, FileText, ChevronRight 
} from "lucide-react";

const helpCategories = [
  {
    icon: ShoppingCart,
    title: "Buying on AfriTrade",
    description: "How to search, order, and manage your purchases",
    href: "/help/buying",
  },
  {
    icon: Users,
    title: "Selling on AfriTrade",
    description: "Set up your store, list products, and manage orders",
    href: "/help/selling",
  },
  {
    icon: Truck,
    title: "Shipping & Delivery",
    description: "Tracking, shipping options, and delivery times",
    href: "/help/shipping",
  },
  {
    icon: CreditCard,
    title: "Payment & Billing",
    description: "Payment methods, invoices, and refunds",
    href: "/help/payments",
  },
  {
    icon: Shield,
    title: "Trade Assurance",
    description: "Protection policies and dispute resolution",
    href: "/help/trade-assurance",
  },
  {
    icon: FileText,
    title: "Account & Settings",
    description: "Profile, security, and notification settings",
    href: "/help/account",
  },
];

const popularTopics = [
  "How do I track my order?",
  "What payment methods are accepted?",
  "How does Trade Assurance work?",
  "How do I become a verified supplier?",
  "What are the shipping options?",
  "How do I request a refund?",
];

const Help = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero-gradient text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-4xl font-bold mb-4">
              How can we help you?
            </h1>
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search for help..."
                  className="pl-12 h-12 bg-background text-foreground"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              Browse by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpCategories.map((category) => (
                <Link
                  key={category.title}
                  to={category.href}
                  className="group bg-card rounded-xl p-6 border border-border hover:border-primary hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <category.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Topics */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              Popular Topics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularTopics.map((topic) => (
                <Link
                  key={topic}
                  to="#"
                  className="flex items-center justify-between bg-card rounded-lg p-4 border border-border hover:border-primary transition-colors"
                >
                  <span className="text-foreground">{topic}</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              Still need help?
            </h2>
            <p className="text-muted-foreground mb-6">
              Our support team is available 24/7 to assist you
            </p>
            <Button size="lg">
              <MessageSquare className="w-5 h-5 mr-2" />
              Contact Support
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Help;
