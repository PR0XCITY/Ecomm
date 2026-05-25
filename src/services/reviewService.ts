import { getLocalData, setLocalData, delay } from "./db";
import type { Review } from "../mock/mockData";

export const reviewService = {
  getReviews: async (includeUnapproved = true): Promise<Review[]> => {
    await delay(200);
    const list = getLocalData<Review[]>("ss_reviews", []);
    if (includeUnapproved) return list;
    return list.filter((r) => r.approved);
  },

  addReview: async (
    productId: string,
    author: string,
    rating: number,
    comment: string
  ): Promise<Review> => {
    await delay(300);
    const list = getLocalData<Review[]>("ss_reviews", []);

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      author,
      rating,
      comment,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      approved: false, // Default unapproved for moderation
    };

    list.unshift(newReview);
    setLocalData("ss_reviews", list);
    return newReview;
  },

  approveReview: async (reviewId: string): Promise<Review> => {
    await delay(300);
    const list = getLocalData<Review[]>("ss_reviews", []);
    const idx = list.findIndex((r) => r.id === reviewId);
    if (idx === -1) throw new Error("Review not found.");

    const updated = {
      ...list[idx],
      approved: true,
    };
    list[idx] = updated;
    setLocalData("ss_reviews", list);

    // Audit Log
    const auditLogs = getLocalData<any[]>("ss_audit_logs", []);
    auditLogs.unshift({
      id: `audit-${Date.now()}`,
      action: `Reviews: Approved review from customer "${updated.author}" on product ID "${updated.productId}"`,
      user: "Admin",
      timestamp: new Date().toLocaleString("en-US", { hour: "numeric", minute: "2-digit", month: "short", day: "numeric" }),
    });
    setLocalData("ss_audit_logs", auditLogs.slice(0, 100));

    return updated;
  },

  rejectReview: async (reviewId: string): Promise<void> => {
    await delay(300);
    const list = getLocalData<Review[]>("ss_reviews", []);
    const filtered = list.filter((r) => r.id !== reviewId);
    setLocalData("ss_reviews", filtered);

    // Audit Log
    const auditLogs = getLocalData<any[]>("ss_audit_logs", []);
    auditLogs.unshift({
      id: `audit-${Date.now()}`,
      action: `Reviews: Rejected/Deleted review ID "${reviewId}"`,
      user: "Admin",
      timestamp: new Date().toLocaleString("en-US", { hour: "numeric", minute: "2-digit", month: "short", day: "numeric" }),
    });
    setLocalData("ss_audit_logs", auditLogs.slice(0, 100));
  }
};
