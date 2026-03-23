export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number | null;
  images: string[];
  featured: boolean;
  inStock: boolean;
  socialLinks: {
    telegram?: string;
    whatsapp?: string;
    messenger?: string;
  };
  createdAt: string;
}

export const CATEGORIES = [
  "Electronics",
  "Accessories",
  "Clothing",
  "Home & Living",
  "Sports",
  "Books",
] as const;

export const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and studio-quality sound. Perfect for music lovers and professionals.",
    category: "Electronics",
    price: 349,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"],
    featured: true,
    inStock: true,
    socialLinks: { telegram: "https://t.me/admin", whatsapp: "https://wa.me/1234567890", messenger: "https://m.me/admin" },
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Minimalist Leather Watch",
    description: "Hand-crafted Italian leather strap with Swiss movement. A timeless piece that pairs with any outfit.",
    category: "Accessories",
    price: 195,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"],
    featured: true,
    inStock: true,
    socialLinks: { telegram: "https://t.me/admin", whatsapp: "https://wa.me/1234567890", messenger: "https://m.me/admin" },
    createdAt: "2024-02-10",
  },
  {
    id: "3",
    name: "Smart Home Speaker",
    description: "360-degree room-filling sound with built-in voice assistant. Control your smart home with just your voice.",
    category: "Electronics",
    price: 129,
    images: ["https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&q=80"],
    featured: false,
    inStock: true,
    socialLinks: { telegram: "https://t.me/admin", whatsapp: "https://wa.me/1234567890" },
    createdAt: "2024-03-05",
  },
  {
    id: "4",
    name: "Organic Cotton Hoodie",
    description: "Sustainably sourced organic cotton, relaxed fit with a modern silhouette. Available in earth tones.",
    category: "Clothing",
    price: 89,
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80"],
    featured: false,
    inStock: true,
    socialLinks: { whatsapp: "https://wa.me/1234567890" },
    createdAt: "2024-03-12",
  },
  {
    id: "5",
    name: "Ceramic Pour-Over Set",
    description: "Artisan-crafted ceramic dripper with thermal carafe. Elevate your morning coffee ritual.",
    category: "Home & Living",
    price: 68,
    images: ["https://images.unsplash.com/photo-1517256064527-9d228fee26d0?w=600&q=80"],
    featured: true,
    inStock: false,
    socialLinks: { telegram: "https://t.me/admin", messenger: "https://m.me/admin" },
    createdAt: "2024-04-01",
  },
  {
    id: "6",
    name: "Titanium Water Bottle",
    description: "Ultra-lightweight titanium construction. Keeps drinks cold for 24 hours or hot for 12. Built to last a lifetime.",
    category: "Sports",
    price: 55,
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80"],
    featured: false,
    inStock: true,
    socialLinks: { whatsapp: "https://wa.me/1234567890" },
    createdAt: "2024-04-15",
  },
];
