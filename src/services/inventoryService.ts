import { getLocalData, setLocalData, delay } from "./db";
import { productService } from "./productService";
import type { ProductLifecycle } from "./productService";

export interface StockAdjustmentLog {
  id: string;
  productId: string;
  productTitle: string;
  previousStock: number;
  newStock: number;
  adjustedBy: string;
  reason: string;
  timestamp: string;
}

export const inventoryService = {
  getInventoryStatus: async (): Promise<ProductLifecycle[]> => {
    // Gets all products including drafts and archived to track stock metrics
    return productService.getProducts(true);
  },

  adjustStock: async (
    productId: string,
    quantity: number,
    adjustedBy: string,
    reason: string
  ): Promise<ProductLifecycle> => {
    await delay(400);

    const list = getLocalData<ProductLifecycle[]>("ss_products", []);
    const idx = list.findIndex((p) => p.id === productId);
    if (idx === -1) throw new Error("Product not found.");

    const product = list[idx];
    const prevStock = product.stock;
    const newStock = Math.max(0, prevStock + quantity);

    // Save updated stock
    const updated = {
      ...product,
      stock: newStock,
    };
    list[idx] = updated;
    setLocalData("ss_products", list);

    // Log adjustment transaction
    const logs = getLocalData<StockAdjustmentLog[]>("ss_inventory_logs", []);
    const newLog: StockAdjustmentLog = {
      id: `inv-${Date.now()}`,
      productId,
      productTitle: product.title,
      previousStock: prevStock,
      newStock,
      adjustedBy,
      reason,
      timestamp: new Date().toLocaleString(),
    };
    logs.unshift(newLog);
    setLocalData("ss_inventory_logs", logs);

    // Also write to audit logs
    const auditLogs = getLocalData<any[]>("ss_audit_logs", []);
    auditLogs.unshift({
      id: `audit-${Date.now()}`,
      action: `Inventory: Adjusted stock of "${product.title}" from ${prevStock} to ${newStock} (${quantity >= 0 ? "+" : ""}${quantity}). Reason: ${reason}`,
      user: adjustedBy,
      timestamp: new Date().toLocaleString("en-US", { hour: "numeric", minute: "2-digit", month: "short", day: "numeric" }),
    });
    setLocalData("ss_audit_logs", auditLogs.slice(0, 100));

    return updated;
  },

  getAdjustmentLogs: async (productId?: string): Promise<StockAdjustmentLog[]> => {
    await delay(300);
    const logs = getLocalData<StockAdjustmentLog[]>("ss_inventory_logs", []);
    if (productId) {
      return logs.filter((l) => l.productId === productId);
    }
    return logs;
  }
};
