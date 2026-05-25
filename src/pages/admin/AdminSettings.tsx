import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";

export const AdminSettings: React.FC = () => {
  const { addToast, settings, updateSettings, banners, updateBanner } = useApp();
  const [storeName, setStoreName] = useState("");
  const [taxRateINR, setTaxRateINR] = useState(18);
  const [taxRateUSD, setTaxRateUSD] = useState(8);
  const [freeShippingThresholdINR, setFreeShippingThresholdINR] = useState(5000);
  const [freeShippingThresholdUSD, setFreeShippingThresholdUSD] = useState(100);
  const [shippingStandardINR, setShippingStandardINR] = useState(300);
  const [shippingStandardUSD, setShippingStandardUSD] = useState(10);
  const [shippingExpressINR, setShippingExpressINR] = useState(600);
  const [shippingExpressUSD, setShippingExpressUSD] = useState(20);
  const [shippingOvernightINR, setShippingOvernightINR] = useState(1000);
  const [shippingOvernightUSD, setShippingOvernightUSD] = useState(35);
  const [orderConfirmationTemplate, setOrderConfirmationTemplate] = useState("");
  const [shippingUpdateTemplate, setShippingUpdateTemplate] = useState("");
  
  // Banner message state
  const [bannerMsg, setBannerMsg] = useState("");

  useEffect(() => {
    if (settings) {
      setStoreName(settings.storeName || "Shuffling Smiles");
      setTaxRateINR(settings.taxRateINR ?? 18);
      setTaxRateUSD(settings.taxRateUSD ?? 8);
      setFreeShippingThresholdINR(settings.freeShippingThresholdINR ?? 5000);
      setFreeShippingThresholdUSD(settings.freeShippingThresholdUSD ?? 100);
      setShippingStandardINR(settings.shippingStandardINR ?? 300);
      setShippingStandardUSD(settings.shippingStandardUSD ?? 10);
      setShippingExpressINR(settings.shippingExpressINR ?? 600);
      setShippingExpressUSD(settings.shippingExpressUSD ?? 20);
      setShippingOvernightINR(settings.shippingOvernightINR ?? 1000);
      setShippingOvernightUSD(settings.shippingOvernightUSD ?? 35);
      if (settings.emailTemplates) {
        setOrderConfirmationTemplate(settings.emailTemplates.orderConfirmation || "");
        setShippingUpdateTemplate(settings.emailTemplates.shippingUpdate || "");
      }
    }
    if (banners) {
      setBannerMsg(banners);
    }
  }, [settings, banners]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = {
        ...settings,
        storeName,
        taxRateINR: Number(taxRateINR),
        taxRateUSD: Number(taxRateUSD),
        freeShippingThresholdINR: Number(freeShippingThresholdINR),
        freeShippingThresholdUSD: Number(freeShippingThresholdUSD),
        shippingStandardINR: Number(shippingStandardINR),
        shippingStandardUSD: Number(shippingStandardUSD),
        shippingExpressINR: Number(shippingExpressINR),
        shippingExpressUSD: Number(shippingExpressUSD),
        shippingOvernightINR: Number(shippingOvernightINR),
        shippingOvernightUSD: Number(shippingOvernightUSD),
        emailTemplates: {
          orderConfirmation: orderConfirmationTemplate,
          shippingUpdate: shippingUpdateTemplate
        }
      };

      await updateSettings(updated);
      addToast("Store configurations saved successfully.");
    } catch {
      addToast("Failed to save store configurations.", "error");
    }
  };

  const handleSaveBanner = () => {
    if (!bannerMsg.trim()) {
      addToast("Banner message cannot be empty.", "error");
      return;
    }
    updateBanner(bannerMsg.trim());
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-outline-variant/20 pb-4">
        <h2 className="font-headline-md text-2xl text-on-surface">Store Configuration Settings</h2>
        <p className="text-xs text-on-surface-variant mt-1">Manage global tax values, regional shipping rates, emails, and promotions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs text-left">
        {/* Main Settings Form */}
        <form onSubmit={handleSaveSettings} className="lg:col-span-2 space-y-6">
          
          {/* General Store Preferences */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <h3 className="font-headline-sm text-sm text-primary border-b border-outline-variant/15 pb-2 mb-4 font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">store</span>
              General Shop Preferences
            </h3>
            <div>
              <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Storefront Brand Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Tax Configurations */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <h3 className="font-headline-sm text-sm text-primary border-b border-outline-variant/15 pb-2 mb-4 font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">percent</span>
              Regional Tax Coefficients
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Indian GST rate (%)</label>
                <input
                  type="number"
                  value={taxRateINR}
                  onChange={(e) => setTaxRateINR(Number(e.target.value))}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">US Sales Tax rate (%)</label>
                <input
                  type="number"
                  value={taxRateUSD}
                  onChange={(e) => setTaxRateUSD(Number(e.target.value))}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Shipping Rates */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <h3 className="font-headline-sm text-sm text-primary border-b border-outline-variant/15 pb-2 mb-4 font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              Fulfillment &amp; Shipping Rates
            </h3>

            <div className="space-y-4">
              <h4 className="font-bold text-primary text-[10px] uppercase tracking-wider">Domestic Rates (INR)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Free Shipping Threshold</label>
                  <input
                    type="number"
                    value={freeShippingThresholdINR}
                    onChange={(e) => setFreeShippingThresholdINR(Number(e.target.value))}
                    className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Standard Ship Price</label>
                  <input
                    type="number"
                    value={shippingStandardINR}
                    onChange={(e) => setShippingStandardINR(Number(e.target.value))}
                    className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Express Ship Price</label>
                  <input
                    type="number"
                    value={shippingExpressINR}
                    onChange={(e) => setShippingExpressINR(Number(e.target.value))}
                    className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Overnight Express Delivery Rate</label>
                  <input
                    type="number"
                    value={shippingOvernightINR}
                    onChange={(e) => setShippingOvernightINR(Number(e.target.value))}
                    className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-outline-variant/10">
              <h4 className="font-bold text-primary text-[10px] uppercase tracking-wider">International Rates (USD)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Free Shipping Threshold</label>
                  <input
                    type="number"
                    value={freeShippingThresholdUSD}
                    onChange={(e) => setFreeShippingThresholdUSD(Number(e.target.value))}
                    className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Standard Ship Price</label>
                  <input
                    type="number"
                    value={shippingStandardUSD}
                    onChange={(e) => setShippingStandardUSD(Number(e.target.value))}
                    className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Express Ship Price</label>
                  <input
                    type="number"
                    value={shippingExpressUSD}
                    onChange={(e) => setShippingExpressUSD(Number(e.target.value))}
                    className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Overnight Express Delivery Rate</label>
                  <input
                    type="number"
                    value={shippingOvernightUSD}
                    onChange={(e) => setShippingOvernightUSD(Number(e.target.value))}
                    className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Email notifications templates */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <h3 className="font-headline-sm text-sm text-primary border-b border-outline-variant/15 pb-2 mb-4 font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">mail</span>
              Transactional Email Notification Layouts
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Order Placement Confirmation Template</label>
                <textarea
                  rows={3}
                  value={orderConfirmationTemplate}
                  onChange={(e) => setOrderConfirmationTemplate(e.target.value)}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none font-mono"
                  placeholder="Use tags like {orderId}..."
                />
              </div>
              <div>
                <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Order Dispatched Shipping Template</label>
                <textarea
                  rows={3}
                  value={shippingUpdateTemplate}
                  onChange={(e) => setShippingUpdateTemplate(e.target.value)}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none font-mono"
                  placeholder="Use tags like {orderId}..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-primary text-on-primary hover:bg-primary/95 text-xs font-bold px-6 py-3 rounded-lg shadow cursor-pointer border-none"
            >
              Save Shop Configurations
            </button>
          </div>
        </form>

        {/* Sidebar Announcement Panel */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <h3 className="font-headline-sm text-sm text-primary border-b border-outline-variant/15 pb-2 mb-4 font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">campaign</span>
              Promo Announcement Bar
            </h3>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              Edits made here instantly update the header notification ticker on the customer storefront page in real-time.
            </p>
            
            <div>
              <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Banner Promo Message</label>
              <textarea
                rows={4}
                value={bannerMsg}
                onChange={(e) => setBannerMsg(e.target.value)}
                className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none"
                placeholder="e.g. Free shipping on all products over ₹5000!"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveBanner}
              className="w-full bg-secondary text-on-secondary hover:bg-secondary/95 text-xs font-bold py-2.5 rounded-lg shadow-sm cursor-pointer border-none"
            >
              Push Update Live
            </button>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <h3 className="font-headline-sm text-sm text-primary border-b border-outline-variant/15 pb-2 mb-4 font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">info</span>
              Configuration Variables
            </h3>
            <div className="space-y-2 text-[10px] text-on-surface-variant font-mono">
              <p><span className="font-bold text-primary">currency:</span> INR / USD</p>
              <p><span className="font-bold text-primary">environment:</span> Production Prototype</p>
              <p><span className="font-bold text-primary">data_sync:</span> LocalStorage DB Sync</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
