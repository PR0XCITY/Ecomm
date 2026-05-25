import { getLocalData, setLocalData, delay } from "./db";
import type { Coupon } from "../mock/mockData";

export interface CouponExtended extends Coupon {
  expiryDate?: string;
  usageLimit?: number;
  usageCount: number;
}

export const couponService = {
  getCoupons: async (): Promise<CouponExtended[]> => {
    await delay(200);
    return getLocalData<CouponExtended[]>("ss_coupons", []);
  },

  createCoupon: async (coupon: Omit<CouponExtended, "usageCount">): Promise<CouponExtended> => {
    await delay(350);
    const list = getLocalData<CouponExtended[]>("ss_coupons", []);
    const uppercaseCode = coupon.code.toUpperCase().trim();

    if (list.some((c) => c.code === uppercaseCode)) {
      throw new Error(`Promo code "${uppercaseCode}" already exists.`);
    }

    const newCoupon: CouponExtended = {
      ...coupon,
      code: uppercaseCode,
      usageCount: 0,
    };

    list.push(newCoupon);
    setLocalData("ss_coupons", list);

    // Audit Log
    const auditLogs = getLocalData<any[]>("ss_audit_logs", []);
    auditLogs.unshift({
      id: `audit-${Date.now()}`,
      action: `Coupons: Created promo code "${uppercaseCode}" with type ${coupon.discountType} and value ${coupon.discountValue}`,
      user: "Admin",
      timestamp: new Date().toLocaleString("en-US", { hour: "numeric", minute: "2-digit", month: "short", day: "numeric" }),
    });
    setLocalData("ss_audit_logs", auditLogs.slice(0, 100));

    return newCoupon;
  },

  updateCoupon: async (code: string, fields: Partial<CouponExtended>): Promise<CouponExtended> => {
    await delay(350);
    const list = getLocalData<CouponExtended[]>("ss_coupons", []);
    const idx = list.findIndex((c) => c.code === code);
    if (idx === -1) throw new Error("Coupon not found.");

    const updated = {
      ...list[idx],
      ...fields,
    };
    list[idx] = updated;
    setLocalData("ss_coupons", list);

    return updated;
  },

  deleteCoupon: async (code: string): Promise<void> => {
    await delay(300);
    const list = getLocalData<CouponExtended[]>("ss_coupons", []);
    const filtered = list.filter((c) => c.code !== code);
    setLocalData("ss_coupons", filtered);

    // Audit Log
    const auditLogs = getLocalData<any[]>("ss_audit_logs", []);
    auditLogs.unshift({
      id: `audit-${Date.now()}`,
      action: `Coupons: Deleted promo code "${code}"`,
      user: "Admin",
      timestamp: new Date().toLocaleString("en-US", { hour: "numeric", minute: "2-digit", month: "short", day: "numeric" }),
    });
    setLocalData("ss_audit_logs", auditLogs.slice(0, 100));
  },

  validateAndApplyCoupon: async (code: string, currentTotal: number, currency: "INR" | "USD" = "INR"): Promise<CouponExtended> => {
    await delay(250);
    const list = getLocalData<CouponExtended[]>("ss_coupons", []);
    const coupon = list.find((c) => c.code === code.toUpperCase().trim() && c.active);

    if (!coupon) throw new Error("Invalid or expired coupon code.");
    if (coupon.minOrderValue && currentTotal < coupon.minOrderValue) {
      throw new Error(`Minimum purchase total of ${currency === "USD" ? "$" : "₹"}${coupon.minOrderValue} is required.`);
    }
    if (coupon.expiryDate && new Date(coupon.expiryDate).getTime() < Date.now()) {
      throw new Error("This promo code has expired.");
    }
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new Error("This promo code has reached its usage limit.");
    }

    return coupon;
  },

  incrementUsage: async (code: string): Promise<void> => {
    const list = getLocalData<CouponExtended[]>("ss_coupons", []);
    const idx = list.findIndex((c) => c.code === code);
    if (idx !== -1) {
      list[idx].usageCount += 1;
      setLocalData("ss_coupons", list);
    }
  }
};
