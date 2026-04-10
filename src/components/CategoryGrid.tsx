import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useProducts } from "@/contexts/ProductContext";
import { ArrowRight } from "lucide-react";

export default function CategoryGrid() {
  const { categories, products } = useProducts();

  // Get first product image for each category as the category thumbnail
  const categoryData = categories.map((cat) => {
    const catProducts = products.filter((p) => p.category === cat.name);
    const image = catProducts[0]?.images?.[0] || "";
    const count = catProducts.length;
    return { ...cat, image, count };
  });

  if (categoryData.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight uppercase">
            Shop by Category
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoryData.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group block relative overflow-hidden rounded-xl bg-muted aspect-[4/5]"
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-4xl font-display font-bold text-muted-foreground/30">
                      {cat.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display text-sm md:text-base font-semibold text-white leading-tight mb-0.5">
                    {cat.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs text-white/70 group-hover:text-white transition-colors">
                    {cat.count} {cat.count === 1 ? "product" : "products"}
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
