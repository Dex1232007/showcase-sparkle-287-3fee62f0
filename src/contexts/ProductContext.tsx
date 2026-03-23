import { createContext, useContext, useState, ReactNode } from "react";
import { Product, defaultProducts } from "@/data/products";

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem("products");
    return stored ? JSON.parse(stored) : defaultProducts;
  });

  const save = (updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  const addProduct = (product: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    save([newProduct, ...products]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    save(products.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    save(products.filter((p) => p.id !== id));
  };

  const getProduct = (id: string) => products.find((p) => p.id === id);

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
};
