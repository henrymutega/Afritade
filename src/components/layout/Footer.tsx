import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();

  const footerLinks = {
    [t('footer.company')]: [
      { name: t('footer.aboutUs'), href: "/about" },
      { name: t('footer.careers'), href: "/about" },
      { name: t('footer.press'), href: "/about" },
      { name: t('footer.blog'), href: "/about" },
    ],
    [t('footer.support')]: [
      { name: t('footer.helpCenter'), href: "/help" },
      { name: t('footer.contactUs'), href: "/help" },
      { name: t('footer.shipping'), href: "/help" },
      { name: t('footer.returns'), href: "/help" },
    ],
    [t('footer.legal')]: [
      { name: t('footer.terms'), href: "/help" },
      { name: t('footer.privacy'), href: "/help" },
      { name: t('footer.cookies'), href: "/help" },
      { name: t('footer.compliance'), href: "/help" },
    ],
  };

  return (
    <footer className="bg-foreground text-background">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 hero-gradient rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">D</span>
              </div>
              <div>
                <h2 className="font-display font-bold text-xl">Tre.David</h2>
                <p className="text-xs text-muted-foreground">China's B2B Marketplace</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              {t('footer.description')}
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
            <p>{t('footer.copyright')}</p>
            <div className="flex gap-4">
              <Link to="/help" className="hover:text-primary transition-colors">{t('footer.privacy')}</Link>
              <Link to="/help" className="hover:text-primary transition-colors">{t('footer.terms')}</Link>
              <Link to="/help" className="hover:text-primary transition-colors">{t('footer.cookies')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
