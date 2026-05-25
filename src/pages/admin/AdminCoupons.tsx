import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { couponService } from "../../services/couponService";
import type { CouponExtended } from "../../services/couponService";

export const AdminCoupons: React.FC = () => {
  const { addToast, reloadCoupons } = useApp();
  const [couponsList, setCouponsList] = useState<CouponExtended[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Coupon Form State
  const [form, setForm] = useState({
    code: "",
    discountType: "percent" as "percent" | "fixed",
    discountValue: 20,
    minOrderValue: 2000,
    usageLimit: 100,
    expiryDate: "",
    active: true,
  });

  const loadCoupons = async () => {
    setIsLoading(true);
    try {
      const data = await couponService.getCoupons();
      setCouponsList(data);
    } catch {
      addToast("Failed to fetch coupons list.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleActiveToggle = async (coupon: CouponExtended) => {
    try {
      await couponService.updateCoupon(coupon.code, { active: !coupon.active });
      addToast(`Promo code ${coupon.code} ${!coupon.active ? "activated" : "deactivated"}.`);
      await loadCoupons();
      await reloadCoupons();
    } catch {
      addToast("Failed to toggle coupon status.", "error");
    }
  };

  const handleDelete = async (code: string) => {
    if (!window.confirm(`Delete coupon code "${code}"?`)) return;
    try {
      await couponService.deleteCoupon(code);
      addToast("Coupon deleted successfully.");
      await loadCoupons();
      await reloadCoupons();
    } catch {
      addToast("Failed to delete coupon.", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) return;

    try {
      await couponService.createCoupon({
        code: form.code.toUpperCase().trim(),
        discountType: form.discountType,
        discountValue: form.discountValue,
        minOrderValue: form.minOrderValue,
        usageLimit: form.usageLimit || undefined,
        expiryDate: form.expiryDate || undefined,
        active: form.active,
      });

      addToast("Promo code published.");
      setForm({
        code: "",
        discountType: "percent",
        discountValue: 20,
        minOrderValue: 2000,
        usageLimit: 100,
        expiryDate: "",
        active: true,
      });
      await loadCoupons();
      await reloadCoupons();
    } catch (err: any) {
      addToast(err.message || "Failed to create coupon.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
        <div>
          <h2 className="font-headline-md text-2xl text-on-surface">Promo Coupons Manager</h2>
          <p className="text-xs text-on-surface-variant mt-1">Publish discount campaigns and adjust usage restrictions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-xs text-left">
        {/* Left: Create Coupon Form (Col 5) */}
        <div className="lg:col-span-5 bg-surface-container-low p-6 rounded-xl border border-outline-variant/20">
          <h3 className="font-label-md text-primary uppercase tracking-wide mb-4">Create Promo Code</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Coupon Code</label>
              <input
                type="text"
                required
                placeholder="e.g. SMILES25"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs font-mono uppercase"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Discount Type</label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value as any })}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed Flat (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Discount Value</label>
                <input
                  type="number"
                  required
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: parseInt(e.target.value) || 0 })}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Min Order Value (₹)</label>
                <input
                  type="number"
                  required
                  value={form.minOrderValue}
                  onChange={(e) => setForm({ ...form, minOrderValue: parseInt(e.target.value) || 0 })}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Usage Limit</label>
                <input
                  type="number"
                  value={form.usageLimit}
                  onChange={(e) => setForm({ ...form, usageLimit: parseInt(e.target.value) || 0 })}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Expiration Date</label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs font-mono"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="accent-primary w-4 h-4"
              />
              <label htmlFor="active" className="text-on-surface-variant select-none">
                Enable code immediately on storefront checkout.
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:bg-primary-container cursor-pointer border-none"
            >
              Publish Coupon
            </button>
          </form>
        </div>

        {/* Right: Coupon List (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-label-md text-on-surface uppercase tracking-wide">Active Coupons Registry</h3>
          <div className="divide-y divide-outline-variant/20 border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-lowest">
            {isLoading ? (
              <p className="text-center py-6 text-on-surface-variant">Checking coupons...</p>
            ) : couponsList.length === 0 ? (
              <p className="text-center py-6 text-on-surface-variant">No active coupons published.</p>
            ) : (
              couponsList.map((coupon) => (
                <div key={coupon.code} className="p-4 flex justify-between items-center hover:bg-surface-container-low/20">
                  <div>
                    <p className="font-mono font-bold text-primary text-sm flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">local_offer</span>
                      {coupon.code}
                    </p>
                    <p className="text-[10px] text-on-surface-variant/80 mt-1">
                      Discount: {coupon.discountType === "percent" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} • Expiry: {coupon.expiryDate || "Never"}
                    </p>
                    <p className="text-[9px] text-on-surface-variant/65 mt-0.5">
                      Usage: {coupon.usageCount} / {coupon.usageLimit || "Unlimited"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleActiveToggle(coupon)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors border-none ${
                        coupon.active ? "bg-[#e6f4ea] text-[#137333]" : "bg-error-container text-error"
                      }`}
                    >
                      {coupon.active ? "Active" : "Disabled"}
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.code)}
                      className="text-error font-bold hover:underline cursor-pointer border-none bg-transparent"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;
