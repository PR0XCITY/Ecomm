import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";

interface QuickViewModalProps {
  productId: string | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ productId, onClose }) => {
  const { catalog, addToCart, setCartDrawerOpen } = useApp();
  const [qty, setQty] = useState(1);
  const [customization, setCustomization] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);

  const product = catalog.find((p) => p.id === productId);

  useEffect(() => {
    if (product) {
      setQty(1);
      setCustomization("");
      setAdded(false);
      // Pre-select first options for variants
      const initial: Record<string, string> = {};
      product.variants?.forEach((v) => {
        if (v.options.length > 0) {
          initial[v.name] = v.options[0];
        }
      });
      setSelectedVariants(initial);
    }
  }, [productId, product]);

  if (!product) return null;

  const handleSelectOption = (variantName: string, option: string) => {
    setSelectedVariants((prev) => ({ ...prev, [variantName]: option }));
  };

  const handleAddToCartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Compile customization with selected variants
    const variantParts = Object.entries(selectedVariants)
      .map(([name, val]) => `${name}: ${val}`)
      .join(" | ");
    
    const finalCustomization = variantParts 
      ? (customization.trim() ? `${variantParts} [Note: ${customization.trim()}]` : variantParts)
      : customization.trim();

    addToCart(product, qty, finalCustomization);
    setAdded(true);

    setTimeout(() => {
      onClose();
      // Slide open the mini cart drawer!
      setCartDrawerOpen(true);
    }, 400);
  };

  // Pricing presentation
  let unitDisplay = "";
  if (product.id === "wedding-invitation-suite") {
    unitDisplay = "/ set of 150";
  } else if (product.id === "custom-gold-foil-cards") {
    unitDisplay = "/ deck of 50";
  } else if (product.id === "personalized-henna-badges") {
    unitDisplay = "/ each";
  }

  const formatPrice = (value: number) => {
    return product.currency === "INR"
      ? `₹${value.toLocaleString()}`
      : `$${value.toFixed(2)}`;
  };

  const formattedPrice = formatPrice(product.price);
  const formattedTotalPrice = formatPrice(product.price * qty);

  return (
    <AnimatePresence>
      {productId && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-surface w-full max-w-4xl rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden relative z-10 grid grid-cols-1 md:grid-cols-2 text-left"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-surface/80 backdrop-blur-sm text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full p-2 z-20 cursor-pointer border-none"
              aria-label="Close details"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* Left Column: Image Section */}
            <div className="relative aspect-[4/5] md:aspect-auto bg-surface-container overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              {product.isBestseller && (
                <span className="absolute top-4 left-4 bg-primary text-on-primary text-xs font-label-md uppercase tracking-wider px-3 py-1 rounded-full">
                  Bestseller
                </span>
              )}
            </div>

            {/* Right Column: Product Configurations */}
            <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-secondary font-bold uppercase tracking-widest">
                    {product.category}
                  </span>
                  <h3 className="font-display-lg text-2xl md:text-3xl text-primary mt-1">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex text-secondary">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span
                          key={idx}
                          className="material-symbols-outlined text-[16px]"
                          style={{ fontVariationSettings: `'FILL' ${idx < Math.floor(product.rating) ? "1" : "0"}` }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-on-surface-variant font-medium">
                      {product.rating} ({product.reviewsCount} reviews)
                    </span>
                  </div>
                </div>

                <p className="text-headline-sm text-primary font-bold">
                  {formattedPrice} <span className="text-xs text-on-surface-variant font-normal">{unitDisplay}</span>
                </p>

                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {product.description}
                </p>

                {/* Configurations Form */}
                <form onSubmit={handleAddToCartSubmit} className="space-y-5">
                  {/* Dynamic Variant Selector List */}
                  {product.variants?.map((v) => (
                    <div key={v.name} className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface">
                        Select {v.name}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {v.options.map((opt) => {
                          const active = selectedVariants[v.name] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleSelectOption(v.name, opt)}
                              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all border-none ${
                                active
                                  ? "bg-primary text-on-primary shadow-sm"
                                  : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Text Customization Area */}
                  <div className="space-y-2">
                    <label
                      htmlFor="modal-customization"
                      className="block text-xs font-bold uppercase tracking-wider text-on-surface"
                    >
                      Bespoke Customization Notes
                    </label>
                    <textarea
                      id="modal-customization"
                      rows={2}
                      value={customization}
                      onChange={(e) => setCustomization(e.target.value)}
                      placeholder="Couple names, dates, colors or card finishing notes..."
                      className="w-full p-3 border border-outline rounded-lg bg-surface-lowest text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  {/* Quantity and Checkout Trigger */}
                  <div className="space-y-3 pt-3 border-t border-outline-variant/20">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-on-surface">Quantity</span>
                      <div className="flex items-center border border-outline rounded-lg bg-surface-lowest overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                          className="px-3 py-1.5 text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">remove</span>
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-on-surface">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty((prev) => prev + 1)}
                          className="px-3 py-1.5 text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">add</span>
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={added}
                      className={`w-full py-3 px-6 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer border-none ${
                        added
                          ? "bg-secondary text-on-secondary"
                          : "bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {added ? "check_circle" : "shopping_bag"}
                      </span>
                      {added ? "Added!" : `Add to Bag - ${formattedTotalPrice}`}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default QuickViewModal;
