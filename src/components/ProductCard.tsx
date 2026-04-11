import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const hasDiscount = product.discount_percentage && product.discount_percentage > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted mb-3">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {hasDiscount && (
              <span className="bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                Sale
              </span>
            )}
            {!product.in_stock && (
              <span className="bg-foreground/80 text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                Sold Out
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:underline decoration-foreground/30 underline-offset-2 transition-all">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            {hasDiscount && product.original_price ? (
              <>
                <span className="text-xs text-muted-foreground line-through tabular-nums">
                  {product.original_price.toLocaleString()} MMK
                </span>
                <span className="text-sm font-medium tabular-nums">
                  {product.price?.toLocaleString()} MMK
                </span>
              </>
            ) : product.price ? (
              <span className="text-sm font-medium tabular-nums">
                {product.price.toLocaleString()} MMK
              </span>
            ) : (
              <span className="text-sm text-muted-foreground italic">Contact for price</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
