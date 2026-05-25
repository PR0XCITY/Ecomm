import { getLocalData, setLocalData, delay } from "./db";
import type { Order } from "../mock/mockData";

export interface OrderExtended extends Order {
  status: "Processing" | "Pending" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";
  shippingAddress?: string;
  fulfillmentLogs?: { timestamp: string; action: string }[];
  refundDetails?: { amount: number; reason: string; timestamp: string };
}

export const orderService = {
  getOrders: async (): Promise<OrderExtended[]> => {
    await delay(300);
    return getLocalData<OrderExtended[]>("ss_orders", []);
  },

  getOrderById: async (id: string): Promise<OrderExtended | null> => {
    await delay(200);
    const list = getLocalData<OrderExtended[]>("ss_orders", []);
    return list.find((o) => o.id === id) || null;
  },

  placeOrder: async (order: Omit<OrderExtended, "id" | "date">): Promise<OrderExtended> => {
    await delay(400);
    const list = getLocalData<OrderExtended[]>("ss_orders", []);

    const newId = `#SS-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const formattedDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newOrder: OrderExtended = {
      ...order,
      id: newId,
      date: formattedDate,
      fulfillmentLogs: [
        { timestamp: new Date().toLocaleString(), action: "Order placed by customer" },
      ],
    };

    list.unshift(newOrder);
    setLocalData("ss_orders", list);
    return newOrder;
  },

  updateOrderStatus: async (
    id: string,
    status: OrderExtended["status"],
    logAction?: string
  ): Promise<OrderExtended> => {
    await delay(300);
    const list = getLocalData<OrderExtended[]>("ss_orders", []);
    const idx = list.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error("Order not found in database.");

    const order = list[idx];
    const log = logAction || `Fulfillment: Marked status as ${status}`;
    const newLogs = [...(order.fulfillmentLogs || []), { timestamp: new Date().toLocaleString(), action: log }];

    const updated = {
      ...order,
      status,
      fulfillmentLogs: newLogs,
    };

    list[idx] = updated;
    setLocalData("ss_orders", list);
    return updated;
  },

  processRefund: async (id: string, reason: string, refundAmount: number): Promise<OrderExtended> => {
    await delay(400);
    const list = getLocalData<OrderExtended[]>("ss_orders", []);
    const idx = list.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error("Order not found in database.");

    const order = list[idx];
    if (refundAmount > order.total) throw new Error("Refund amount exceeds order total value.");

    const updated: OrderExtended = {
      ...order,
      status: "Refunded",
      refundDetails: {
        amount: refundAmount,
        reason,
        timestamp: new Date().toLocaleString(),
      },
      fulfillmentLogs: [
        ...(order.fulfillmentLogs || []),
        { timestamp: new Date().toLocaleString(), action: `Refund: Processed ₹${refundAmount.toLocaleString()} for: ${reason}` },
      ],
    };

    list[idx] = updated;
    setLocalData("ss_orders", list);
    return updated;
  }
};
