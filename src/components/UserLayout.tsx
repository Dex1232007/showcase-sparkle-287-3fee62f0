import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
];

export default function UserLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { navbarSettings, footerSettings, branding, announcement } = useSiteSettings();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Announcement Bar */}
      {announcement.enabled && announcement.text && (
        <div className="gradient-accent text-primary-foreground text-center py-2.5 px-4 text-xs sm:text-sm font-medium">
          <Link to={announcement.link || "/products"} className="inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity">
            {announcement.text}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="container flex h-16 items-center justify-between">
          {/* Left: mobile menu */}
          <div className="flex items-center gap-2 w-1/3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors active:scale-95"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    location.pathname === link.to ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <motion.div layoutId="nav-underline" className="absolute -bottom-0.5 left-0 right-0 h-0.5 gradient-accent rounded-full" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Logo */}
          <div className="flex items-center justify-center w-1/3">
            <Link to="/" className="flex items-center gap-2 group">
              {branding.logo_url ? (
                <img src={branding.logo_url} alt={navbarSettings.brand_name} className="h-9 w-auto object-contain" />
              ) : (
                <span className="font-display text-xl font-bold tracking-tight">{navbarSettings.brand_name}</span>
              )}
            </Link>
          </div>

          {/* Right: search + theme toggle */}
          <div className="flex items-center justify-end gap-2 w-1/3">
            <Link to="/products" className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </Link>
            {navbarSettings.show_theme_toggle && <ThemeToggle />}
          </div>
        </div>

        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t">
            <nav className="container py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.to ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* Premium Footer matching wutaleather style */}
      <footer className="bg-foreground text-background mt-16">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              {branding.logo_url ? (
                <img src={branding.logo_url} alt={navbarSettings.brand_name} className="h-10 w-auto object-contain mb-4 brightness-0 invert" />
              ) : (
                <h3 className="font-display text-xl font-bold mb-4">{navbarSettings.brand_name}</h3>
              )}
              <p className="text-sm text-background/60 leading-relaxed max-w-xs">
                {footerSettings.text}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2.5">
                <li><Link to="/" className="text-sm text-background/60 hover:text-background transition-colors">Home</Link></li>
                <li><Link to="/products" className="text-sm text-background/60 hover:text-background transition-colors">Products</Link></li>
                <li><Link to="/products" className="text-sm text-background/60 hover:text-background transition-colors">New Arrivals</Link></li>
                <li><Link to="/products" className="text-sm text-background/60 hover:text-background transition-colors">Featured</Link></li>
              </ul>
            </div>

            {/* Info */}
            <div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4">Information</h4>
              <ul className="space-y-2.5">
                <li><span className="text-sm text-background/60">Contact us for any inquiries</span></li>
                <li><span className="text-sm text-background/60">Fast & reliable delivery</span></li>
                <li><span className="text-sm text-background/60">Quality guaranteed products</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10">
          <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-background/40">
              © {new Date().getFullYear()} {navbarSettings.brand_name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
