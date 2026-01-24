import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  "Get to Know Us": [
    { name: "About Tre.David", href: "/about" },
    { name: "Careers", href: "/about" },
    { name: "Press Releases", href: "/about" },
    { name: "Tre.David Cares", href: "/about" },
  ],
  "Sell on Tre.David": [
    { name: "Start Selling", href: "/sell" },
    { name: "Seller Central", href: "/sell" },
    { name: "Supplier Membership", href: "/sell" },
    { name: "Advertise Products", href: "/sell" },
  ],
  "Buy on Tre.David": [
    { name: "How to Buy", href: "/help" },
    { name: "Trade Assurance", href: "/help" },
    { name: "Payment Methods", href: "/help" },
    { name: "Shipping Info", href: "/help" },
  ],
  "Trade Services": [
    { name: "Trade Assurance", href: "/help" },
    { name: "Business Identity", href: "/help" },
    { name: "Logistics Services", href: "/help" },
    { name: "Letter of Credit", href: "/help" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 hero-gradient rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">D</span>
              </div>
              <div>
                <h2 className="font-display font-bold text-xl">Tre.David</h2>
                <p className="text-xs text-muted-foreground">B2B Marketplace</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Connecting manufacturers, suppliers and buyers worldwide.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div className="border-t border-muted/20 mt-8 pt-8">
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span>hello@tredavid.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>+254 700 123 456</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Nairobi, Kenya</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-muted/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026 Tre.David. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/help" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/help" className="hover:text-primary transition-colors">Terms of Use</Link>
              <Link to="/help" className="hover:text-primary transition-colors">Cookie Settings</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
