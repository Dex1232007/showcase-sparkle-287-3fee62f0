import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "@/contexts/ProductContext";
import UserLayout from "@/components/UserLayout";
import { motion } from "framer-motion";
import { ArrowLeft, Star, MessageCircle, Send, Phone, Percent, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { getProduct, loading } = useProducts();
  const [selectedImage, setSelectedImage] = useState(0);
  const product = getProduct(id!);

  if (loading) {
    return (
      <UserLayout>
        <section className="py-12">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-3">
                <Skeleton className="aspect-square rounded-2xl" />
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="w-16 h-16 rounded-lg" />)}
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
        </section>
      </UserLayout>
    );
  }

  if (!product) {
    return (
      <UserLayout>
        <div className="container py-24 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Product Not Found</h1>
          <Link to="/products" className="text-accent hover:underline">Back to products</Link>
        </div>
      </UserLayout>
    );
  }

  const images = product.images.length > 0 ? product.images : ["/placeholder.svg"];
  const contactMessage = encodeURIComponent(`Hello, I'm interested in ${product.name}`);
  const hasDiscount = product.discount_percentage && product.discount_percentage > 0;

  const prevImage = () => setSelectedImage((i) => (i - 1 + images.length) % images.length);
  const nextImage = () => setSelectedImage((i) => (i + 1) % images.length);

  return (
    <UserLayout>
      <section className="py-8 md:py-12">
        <div className="container">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 md:mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to products
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted group">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {hasDiscount && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                    <Percent className="w-3 h-3" />
                    {product.discount_percentage}% OFF
                  </div>
                )}
                {images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/70 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity active:scale-95">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/70 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity active:scale-95">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        i === selectedImage ? "border-accent ring-1 ring-accent/30" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-center"
            >
              <p className="text-xs uppercase tracking-widest text-accent font-medium mb-2">{product.category}</p>
              <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-4 leading-tight">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {product.featured && (
                  <span className="inline-flex items-center gap-1 gradient-accent text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
                    <Star className="w-3 h-3" /> Featured
                  </span>
                )}
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${product.in_stock ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                  {product.in_stock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {product.price !== null && product.price !== undefined && (
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                  <p className="text-2xl md:text-3xl font-bold tabular-nums">{product.price.toLocaleString()} MMK</p>
                  {hasDiscount && product.original_price && (
                    <p className="text-lg md:text-xl text-muted-foreground line-through tabular-nums">{product.original_price.toLocaleString()} MMK</p>
                  )}
                </div>
              )}

              <p className="text-muted-foreground leading-relaxed mb-8 text-sm md:text-base">{product.description}</p>

              {/* Social Contact Buttons */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Contact the seller</p>
                <div className="grid grid-cols-2 gap-2">
                  {product.social_whatsapp && (
                    <Button asChild variant="outline" className="active:scale-95 transition-transform h-11">
                      <a href={`${product.social_whatsapp}?text=${contactMessage}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                      </a>
                    </Button>
                  )}
                  {product.social_telegram && (
                    <Button asChild variant="outline" className="active:scale-95 transition-transform h-11">
                      <a href={product.social_telegram} target="_blank" rel="noopener noreferrer">
                        <Send className="w-4 h-4 mr-2" /> Telegram
                      </a>
                    </Button>
                  )}
                  {product.social_messenger && (
                    <Button asChild variant="outline" className="active:scale-95 transition-transform h-11">
                      <a href={product.social_messenger} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4 mr-2" /> Messenger
                      </a>
                    </Button>
                  )}
                  {product.social_viber && (
                    <Button asChild variant="outline" className="active:scale-95 transition-transform h-11">
                      <a href={product.social_viber} target="_blank" rel="noopener noreferrer">
                        <Phone className="w-4 h-4 mr-2" /> Viber
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </UserLayout>
  );
}
