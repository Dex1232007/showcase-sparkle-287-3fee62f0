import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
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
        <div className="gradient-accent text-primary-foreground text-center py-2 px-4 text-xs sm:text-sm font-medium">
          <Link to={announcement.link || "/products"} className="inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity">
            {announcement.text}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container flex h-16 items-center justify-between">
          {/* Left: mobile menu + nav links */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors active:scale-95"
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
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 group">
            {branding.logo_url ? (
              <img src={branding.logo_url} alt={navbarSettings.brand_name} className="h-9 w-auto object-contain" />
            ) : (
              <span className="font-display text-xl font-semibold tracking-tight">{navbarSettings.brand_name}</span>
            )}
          </Link>

          {/* Right: theme toggle */}
          <div className="flex items-center gap-2">
            {navbarSettings.show_theme_toggle && <ThemeToggle />}
          </div>
        </div>

        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t">
            <nav className="container py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.to ? "bg-muted text-foreground" : "text-muted-foreground"}`}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-8 mt-16">
        <div className="container text-center text-sm text-muted-foreground">
          <p>{footerSettings.text}</p>
        </div>
      </footer>
    </div>
  );
}
