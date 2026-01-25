import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { AccountTypesSection } from "@/components/home/AccountTypesSection";
import { TrustSection } from "@/components/home/TrustSection";
import { CTASection } from "@/components/home/CTASection";
import { SuppliersSection } from "@/components/home/SuppliersSection";

const index = () => {
  return (
    <div className="min-h-screen bg-background">
        <Header />
        <main>
            <HeroSection />
            <CategoriesSection />
            <FeaturedProducts />
            <SuppliersSection />
            <TrustSection />
            <AccountTypesSection />
            <CTASection />
        </main>
        <Footer />
    </div>
  );
};

export default index;