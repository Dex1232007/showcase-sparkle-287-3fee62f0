import { useProducts } from "@/contexts/ProductContext";
import UserLayout from "@/components/UserLayout";
import HeroSlider from "@/components/HeroSlider";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import NewArrivals from "@/components/NewArrivals";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Index() {
  const { products } = useProducts();
  const { sliderSlides } = useSiteSettings();
  const featured = products.filter((p) => p.featured);
  const onSale = products.filter((p) => p.discount_percentage && p.discount_percentage > 0);

  return (
    <UserLayout>
      {/* Hero Slider or fallback Hero */}
      {sliderSlides.length > 0 ? (
        <section className="w-full">
          <HeroSlider />
        </section>
      ) : (
        <HeroSection />
      )}

      {/* Shop by Category */}
      <CategoryGrid />

      {/* Featured / Best Sellers */}
      {featured.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight uppercase">
                Featured Products
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featured.slice(0, 4).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 text-center"
            >
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-foreground/20 hover:bg-foreground hover:text-background transition-all">
                <Link to="/products">
                  View all
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* On Sale */}
      {onSale.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 flex items-center gap-3"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight uppercase">
                On Sale 🔥
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {onSale.slice(0, 4).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <NewArrivals />
    </UserLayout>
  );
}
