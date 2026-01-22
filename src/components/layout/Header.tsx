import { Search, ShoppingCart, User, Menu, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Electronics", href: "/products?category=electronics" },
  { name: "Machinery", href: "/products?category=machinery" },
  { name: "Agriculture", href: "/products?category=agriculture" },
  { name: "Textiles", href: "/products?category=textiles" },
  { name: "Minerals", href: "/products?category=minerals" },
  { name: "Food & Beverages", href: "/products?category=food" },
  { name: "Construction", href: "/products?category=construction" },
  { name: "Auto Parts", href: "/products?category=auto" },
];

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      {/* Top bar */}
      <div className="bg-foreground text-background">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              Ship to:: Kenya
            </span>
            <span>KES - Kenyan Shilling</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/help" className="hover:text-primary transition-colors">Help Center</Link>
            <Link to="/sell" className="hover:text-primary transition-colors">Become a Supplier</Link>
            <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 hero-gradient rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">A</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-xl text-foreground">AfriTrade</h1>
              <p className="text-xs text-muted-foreground">Africa's B2B Marketplace</p>
            </div>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-r-none border-r-0 hidden md:flex">
                    All Categories <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat.name} asChild>
                      <Link to={cat.href}>{cat.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search products, suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-none md:rounded-l-none border-r-0 h-10"
                />
              </div>
              <Button className="rounded-l-none" size="default">
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Search</span>
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/signin">Sign In</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/register">Create Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>My Orders</DropdownMenuItem>
                <DropdownMenuItem>Messages</DropdownMenuItem>
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
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.href}
                className="whitespace-nowrap text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
