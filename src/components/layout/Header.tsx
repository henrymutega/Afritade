import { Search, ShoppingCart, User, Menu, ChevronDown, Globe, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { SettingsDropdown } from "./SettingsDropdown";

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

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, profile, userRole, signOut} = useAuth();
  const { t } = useTranslation();

  const displayName = profile?.full_name || user?.email || "";

  const canAccessDashboard = userRole === "supplier" || userRole === "manufacturer";


  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/signin";
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      {/* Top bar */}
      <div className="bg-foreground text-background">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              {t('header.shipTo')}: {t('header.kenya')}
            </span>
            <span>{t('header.currency')}</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/help" className="hover:text-primary transition-colors">{t('common.help')}</Link>
            <Link to="/sell" className="hover:text-primary transition-colors">{t('header.becomeSupplier')}</Link>
            <Link to="/about" className="hover:text-primary transition-colors">{t('common.about')}</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 hero-gradient rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">D</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-xl text-foreground">Tre.David</h1>
              <p className="text-xs text-muted-foreground">Africa's B2B Marketplace</p>
            </div>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-r-none border-r-0 hidden md:flex">
                    {t('header.allCategories')} <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-popover">
                  {categoryKeys.map((cat) => (
                    <DropdownMenuItem key={cat.key} asChild>
                      <Link to={cat.href}>{t(`categories.${cat.key}`)}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder={t('header.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-none md:rounded-l-none border-r-0 h-10"
                />
              </div>
              <Button className="rounded-l-none" size="default">
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">{t('common.search')}</span>
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </Button>
            
            <SettingsDropdown />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover">
                {user ? (
                  <>
                    <DropdownMenuItem disabled className="text-muted-foreground">
                      {displayName}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {canAccessDashboard && (
                      <DropdownMenuItem asChild>
                      <Link to="/dashboard">{t('common.dashboard')}</Link>
                    </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>{t('common.myOrders')}</DropdownMenuItem>
                    <DropdownMenuItem>{t('common.messages')}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('common.signOut')}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/signin">{t('common.signIn')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register">{t('common.register')}</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Categories bar */}
      <div className="border-t border-border bg-muted/50">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-6 overflow-x-auto py-3 text-sm">
            {categoryKeys.map((cat) => (
              <Link
                key={cat.key}
                to={cat.href}
                className="whitespace-nowrap text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {t(`categories.${cat.key}`)}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
