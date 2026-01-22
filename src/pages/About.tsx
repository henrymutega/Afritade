import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Globe, Users, TrendingUp, Shield } from "lucide-react";

const stats = [
  { label: "Active Suppliers", value: "500+" },
  { label: "Products Listed", value: "10,000+" },
  { label: "Countries Served", value: "7" },
  { label: "Monthly Transactions", value: "KES 2B+" },
];

const values = [
  {
    icon: Globe,
    title: "Pan-African Vision",
    description: "We're committed to connecting businesses across all 54 African nations, fostering continental trade and economic growth.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Our platform is built by Africans, for Africans. We understand the unique challenges and opportunities in our markets.",
  },
  {
    icon: TrendingUp,
    title: "Growth Enablement",
    description: "We provide tools, resources, and connections that help small and medium businesses scale beyond borders.",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description: "Every transaction is protected by our Trade Assurance program, ensuring safe and reliable business relationships.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero-gradient text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-5xl font-bold mb-4">
              About AfriTrade
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Africa's leading B2B marketplace, connecting manufacturers, suppliers, and buyers across the continent.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-card border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To revolutionize intra-African trade by creating a seamless, secure, and efficient digital marketplace that empowers businesses of all sizes. We believe that by connecting African manufacturers and suppliers with buyers worldwide, we can drive economic growth, create jobs, and showcase the incredible potential of African industry.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div key={value.title} className="bg-card rounded-xl p-6 border border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-foreground text-center mb-8">
                Our Story
              </h2>
              <div className="prose prose-lg mx-auto text-muted-foreground">
                <p className="mb-4">
                  AfriTrade was founded in 2026 with a simple yet ambitious goal: to make it easier for African businesses to trade with each other and the world. Our founders, experienced entrepreneurs from Africa, saw firsthand the challenges that manufacturers and suppliers faced in reaching new markets.
                </p>
                <p className="mb-4">
                  Today, AfriTrade has grown into Africa's largest B2B marketplace, serving businesses in all 7 African countries. From small artisans to large manufacturers, we provide the tools and connections needed to grow and thrive in the global economy.
                </p>
                <p>
                  Our commitment to trust, transparency and African excellence drives everything we do. We're not just building a platform – we're building the future of African trade.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
