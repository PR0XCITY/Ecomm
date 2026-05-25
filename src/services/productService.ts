import { getLocalData, setLocalData, delay } from "./db";
import type { Product } from "../mock/mockData";

export interface ProductLifecycle extends Product {
  status: "Draft" | "Published" | "Scheduled" | "Archived";
  scheduledDate?: string;
  variants?: { name: string; options: string[] }[]; // e.g., Size, Color, Stock Type
  seo?: { title: string; description: string };
  specifications?: { name: string; value: string }[];
  tags?: string[];
}

export const productService = {
  getProducts: async (includeHidden = false): Promise<ProductLifecycle[]> => {
    await delay(300);
    const list = getLocalData<ProductLifecycle[]>("ss_products", []);

    if (includeHidden) return list;

    // Filter for storefront view: only return Published products
    return list.filter((p) => {
      if (p.status === "Published") return true;
      if (p.status === "Scheduled" && p.scheduledDate) {
        return new Date(p.scheduledDate).getTime() <= Date.now();
      }
      return false;
    });
  },

  getProductById: async (id: string): Promise<ProductLifecycle | null> => {
    await delay(200);
    const list = getLocalData<ProductLifecycle[]>("ss_products", []);
    return list.find((p) => p.id === id) || null;
  },

  createProduct: async (product: Omit<ProductLifecycle, "id" | "currency" | "priceFormatted" | "rating" | "reviewsCount">): Promise<ProductLifecycle> => {
    await delay(400);
    const list = getLocalData<ProductLifecycle[]>("ss_products", []);

    const newId = product.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + `-${Date.now().toString().slice(-4)}`;
    
    const newProduct: ProductLifecycle = {
      ...product,
      id: newId,
      rating: 5.0,
      reviewsCount: 0,
      currency: "INR",
      priceFormatted: `₹${product.price.toLocaleString()}`,
    };

    list.push(newProduct);
    setLocalData("ss_products", list);
    return newProduct;
  },

  updateProduct: async (id: string, updatedFields: Partial<ProductLifecycle>): Promise<ProductLifecycle> => {
    await delay(400);
    const list = getLocalData<ProductLifecycle[]>("ss_products", []);
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Product not found in database.");

    const updated = {
      ...list[idx],
      ...updatedFields,
      priceFormatted: updatedFields.price
        ? `₹${updatedFields.price.toLocaleString()}`
        : list[idx].priceFormatted,
    };

    list[idx] = updated;
    setLocalData("ss_products", list);
    return updated;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await delay(300);
    const list = getLocalData<ProductLifecycle[]>("ss_products", []);
    const filtered = list.filter((p) => p.id !== id);
    setLocalData("ss_products", filtered);
  },

  duplicateProduct: async (id: string): Promise<ProductLifecycle> => {
    await delay(400);
    const list = getLocalData<ProductLifecycle[]>("ss_products", []);
    const original = list.find((p) => p.id === id);
    if (!original) throw new Error("Original product not found.");

    const duplicated: ProductLifecycle = {
      ...original,
      id: `${original.id}-copy-${Date.now().toString().slice(-4)}`,
      title: `${original.title} (Copy)`,
      status: "Draft", // Always duplicate as draft
    };

    list.push(duplicated);
    setLocalData("ss_products", list);
    return duplicated;
  }
};
