import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Product } from "@/data/products";
import { Star, ShoppingBag } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { currency } = useSiteSettings();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-accent/30 shadow-sm hover:shadow-xl transition-all duration-500"
        >
          {/* Image container with overlay */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Quick action button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
            >
              <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-4 h-4 text-primary-foreground" />
              </div>
            </motion.div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.featured && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1 gradient-accent text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md"
              >
                <Star className="w-3 h-3" />
                Featured
              </motion.div>
            )}
            {!product.in_stock && (
              <div className="bg-foreground/80 backdrop-blur-sm text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                Sold Out
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-2">
            <p className="text-[10px] text-accent font-bold uppercase tracking-[0.15em]">
              {product.category}
            </p>
            <h3 className="font-display text-base font-semibold leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {/* Price bar */}
            <div className="pt-2 flex items-center justify-between">
              {product.price ? (
                <p className="text-lg font-bold tabular-nums">
                  {currency.symbol}{product.price.toLocaleString()}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">Contact for price</p>
              )}
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                View Details →
              </span>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="h-0.5 w-0 group-hover:w-full gradient-accent transition-all duration-500" />
        </motion.div>
      </Link>
    </motion.div>
  );
}
