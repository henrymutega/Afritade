import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const benefits = [
  "Free to join - no setup fees",
  "Reach buyers across 54 African countries",
  "Trade Assurance on every transaction",
  "Dedicated account manager",
];

export const CTASection = () => {
  return (
    <section className="py-20 bg-foreground text-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Ready to Grow Your Business in Africa?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of businesses already trading on AfriTrade. Start selling your products to buyers across the continent today.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right form */}
            <div className="bg-card text-foreground rounded-2xl p-8 card-shadow">
              <h3 className="font-display text-xl font-bold mb-6">
                Create Your Free Account
              </h3>
              <form className="space-y-4">
                <div>
                  <Input 
                    type="text" 
                    placeholder="Business Name" 
                    className="h-12"
                  />
                </div>
                <div>
                  <Input 
                    type="email" 
                    placeholder="Business Email" 
                    className="h-12"
                  />
                </div>
                <div>
                  <Input 
                    type="tel" 
                    placeholder="Phone Number (+254...)" 
                    className="h-12"
                  />
                </div>
                <div>
                  <select className="w-full h-12 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground">
                    <option value="">Select Account Type</option>
                    <option value="buyer">Buyer</option>
                    <option value="supplier">Supplier</option>
                    <option value="manufacturer">Manufacturer</option>
                  </select>
                </div>
                <Button variant="hero" size="xl" className="w-full">
                  Create Account <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
