import { useState } from "react";
import { Menu, Home, Package, Users, HelpCircle, Info, ShoppingBag, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { useUserRole } from "@/hooks/useUserRole";

const categoryKeys = [
  { key: "electronics", href: "/products?category=electronics" },
  { key: "machinery", href: "/products?category=machinery" },
  { key: "agriculture", href: "/products?category=agriculture" },
  { key: "textiles", href: "/products?category=textiles" },
  { key: "minerals", href: "/products?category=minerals" },
  { key: "foodBeverages", href: "/products?category=food" },
  { key: "construction", href: "/products?category=construction" },
  { key: "autoParts", href: "/products?category=auto" },
];

export const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { user, profile, signOut } = useAuth();
  const { role: userRoleValue } = useUserRole();
  const displayName = profile?.full_name || user?.email || "";
  const canAccessDashboard = userRoleValue === "supplier" || userRoleValue === "manufacturer";

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <div className="w-8 h-8 hero-gradient rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">D</span>
            </div>
            <span className="font-display font-bold text-lg">Tre.David</span>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
          <nav className="p-4 space-y-1">
            <Link
              to="/"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-accent transition-colors"
            >
              <Home className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{t('common.home')}</span>
            </Link>
            <Link
              to="/products"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-accent transition-colors"
            >
              <Package className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{t('common.products')}</span>
            </Link>
            <Link
              to="/suppliers"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-accent transition-colors"
            >
              <Users className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{t('common.suppliers')}</span>
            </Link>
            <Link
              to="/help"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-accent transition-colors"
            >
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{t('common.help')}</span>
            </Link>
            <Link
              to="/about"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-accent transition-colors"
            >
              <Info className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{t('common.about')}</span>
            </Link>
            <Link
              to="/sell"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-accent transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{t('header.becomeSupplier')}</span>
            </Link>
          </nav>

          <Separator />

          {/* Categories */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {t('header.allCategories')}
            </h3>
            <div className="space-y-1">
              {categoryKeys.map((cat) => (
                <Link
                  key={cat.key}
                  to={cat.href}
                  onClick={handleLinkClick}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-foreground hover:bg-accent transition-colors"
                >
                  <span className="text-sm">{t(`categories.${cat.key}`)}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>

          <Separator />

          {/* User Actions */}
          <div className="p-4 mt-auto">
            {user ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground px-3 truncate">{displayName}</p>
                {canAccessDashboard && (
                <Link
                  to="/dashboard"
                  onClick={handleLinkClick}
                  className="block w-full"
                >
                  <Button variant="outline" className="w-full justify-start">
                    {t('common.dashboard')}
                  </Button>
                </Link>
                )}
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => {
                    signOut();
                    handleLinkClick();
                  }}
                >
                  {t('common.signOut')}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link to="/signin" onClick={handleLinkClick} className="block">
                  <Button variant="outline" className="w-full">
                    {t('common.signIn')}
                  </Button>
                </Link>
                <Link to="/register" onClick={handleLinkClick} className="block">
                  <Button className="w-full">
                    {t('common.register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
