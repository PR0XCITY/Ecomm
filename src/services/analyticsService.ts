import { getLocalData, delay } from "./db";
import type { OrderExtended } from "./orderService";
import type { ProductLifecycle } from "./productService";

export interface DashboardStats {
  revenueToday: number;
  revenueThisMonth: number;
  ordersToday: number;
  averageOrderValue: number;
  conversionRate: number;
  returningCustomerRate: number;
  lowStockCount: number;
  topSellingProducts: { title: string; count: number; image: string; revenue: number }[];
}

export const analyticsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(300);

    const orders = getLocalData<OrderExtended[]>("ss_orders", []);
    const products = getLocalData<ProductLifecycle[]>("ss_products", []);

    // 1. Calculate revenue and order counts
    const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    
    const ordersToday = orders.filter((o) => o.date === todayStr && o.status !== "Cancelled");
    const revenueToday = ordersToday.reduce((sum, o) => sum + o.total, 0);

    const revenueThisMonth = orders
      .filter((o) => o.status !== "Cancelled" && o.status !== "Refunded")
      .reduce((sum, o) => sum + o.total, 0); // Aggregate total mock sales

    const averageOrderValue = orders.length > 0 ? Math.round(revenueThisMonth / orders.length) : 0;

    // 2. Mock metrics based on order parameters
    const conversionRate = 3.82; // 3.82% mock
    const returningCustomerRate = 44.5; // 44.5% mock

    // 3. Stock metrics
    const lowStockCount = products.filter((p) => p.stock <= 20).length;

    // 4. Top selling products
    const productSalesMap: Record<string, { count: number; title: string; image: string; revenue: number }> = {};
    
    orders.forEach((order) => {
      if (order.status === "Cancelled") return;
      order.items.forEach((item) => {
        if (!productSalesMap[item.id]) {
          productSalesMap[item.id] = {
            count: 0,
            title: item.title,
            image: item.image,
            revenue: 0,
          };
        }
        productSalesMap[item.id].count += item.quantity;
        productSalesMap[item.id].revenue += item.price * item.quantity;
      });
    });

    const topSellingProducts = Object.values(productSalesMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      revenueToday,
      revenueThisMonth,
      ordersToday: ordersToday.length,
      averageOrderValue,
      conversionRate,
      returningCustomerRate,
      lowStockCount,
      topSellingProducts,
    };
  }
};
