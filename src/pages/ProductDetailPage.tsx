import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    detailedProductId,
    addToCart,
    navigateTo,
    catalog,
    reviews,
    addReview,
    toggleWishlist,
    wishlist,
    setCartDrawerOpen,
    addViewedProduct,
  } = useApp();

  const [qty, setQty] = useState(1);
  const [customization, setCustomization] = useState("");
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "specs" | "shipping">("details");

  // Review Form state
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const activeProductId = id || detailedProductId;

  // Find the current product from global catalog
  const product = catalog.find((p) => p.id === activeProductId) || catalog[0];

  useEffect(() => {
    // Reset inputs on product change
    setQty(1);
    setCustomization("");
    setAddedFeedback(false);

    if (id) {
      addViewedProduct(id);
    }
    
    // Initialize default variants
    if (product) {
      const initial: Record<string, string> = {};
      product.variants?.forEach((v) => {
        if (v.options.length > 0) {
          initial[v.name] = v.options[0];
        }
      });
      setSelectedVariants(initial);
    }
  }, [id, detailedProductId, product]);

  if (!product) {
    return (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24 text-center">
        <h2 className="font-headline-sm text-primary">Product not found</h2>
        <button onClick={() => navigateTo("shop")} className="mt-4 bg-primary text-on-primary px-6 py-2 rounded-full cursor-pointer">
          Return to Shop
        </button>
      </div>
    );
  }

  const handleSelectOption = (variantName: string, option: string) => {
    setSelectedVariants((prev) => ({ ...prev, [variantName]: option }));
  };

  // Luxury pricing calculations with premium adjustments
  let priceMultiplier = 1;
  if (selectedVariants["Paper Weight"] === "600gsm Cotton") priceMultiplier = 1.2;
  if (selectedVariants["Paper Weight"] === "800gsm Letterpress") priceMultiplier = 1.45;
  if (selectedVariants["Pack Size"] === "Double Set in Wooden Box") priceMultiplier = 2.3;
  if (selectedVariants["Tuck Style"] === "Signature Acrylic Case") priceMultiplier = 1.4;

  const basePrice = Math.round(product.price * priceMultiplier);
  const totalPrice = basePrice * qty;

  const formatPrice = (value: number) => {
    return product.currency === "INR"
      ? `₹ ${value.toLocaleString()}`
      : `$${value.toFixed(2)}`;
  };

  const handleAddToCart = () => {
    const variantParts = Object.entries(selectedVariants)
      .map(([name, val]) => `${name}: ${val}`)
      .join(" | ");
    
    const finalCustomization = variantParts 
      ? (customization.trim() ? `${variantParts} [Note: ${customization.trim()}]` : variantParts)
      : customization.trim();

    addToCart(product, qty, finalCustomization);
    setAddedFeedback(true);
    
    setTimeout(() => {
      setCartDrawerOpen(true);
      setAddedFeedback(false);
    }, 600);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    addReview(product.id, reviewName.trim(), reviewRating, reviewComment.trim());
    setReviewName("");
    setReviewRating(5);
    setReviewComment("");
  };

  // Filter approved reviews for this product
  const productReviews = reviews.filter((r) => r.productId === product.id && r.approved);

  // Recommended related products
  const relatedProducts = catalog
    .filter((p) => p && product && p.id !== product.id && (p.category === product.category || (Array.isArray(p.aesthetics) && Array.isArray(product.aesthetics) && p.aesthetics.some(a => product.aesthetics.includes(a)))))
    .slice(0, 3);

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16 text-left">
      
      {/* Luxury Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumb" className="mb-8 text-xs text-on-surface-variant flex flex-wrap items-center gap-1.5 font-medium">
        <button onClick={() => navigateTo("home")} className="hover:text-primary transition-colors cursor-pointer border-none bg-transparent">Home</button>
        <span className="material-symbols-outlined text-[12px] opacity-50">chevron_right</span>
        <button onClick={() => navigateTo("shop")} className="hover:text-primary transition-colors cursor-pointer border-none bg-transparent">Shop</button>
        <span className="material-symbols-outlined text-[12px] opacity-50">chevron_right</span>
        <button onClick={() => navigateTo("shop", product.category)} className="hover:text-primary transition-colors cursor-pointer border-none bg-transparent">{product.category}</button>
        <span className="material-symbols-outlined text-[12px] opacity-50">chevron_right</span>
        <span className="text-primary font-bold">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-desktop items-start">
        
        {/* Left: Product Image with Zoom / Lightbox Trigger */}
        <div className="w-full space-y-4">
          <div 
            onClick={() => setLightboxOpen(true)}
            className="w-full relative rounded-xl overflow-hidden bg-surface-container-high shadow-sm group cursor-zoom-in"
          >
            <img
              alt={product.title}
              className="w-full h-auto object-cover aspect-[4/5] transform transition-transform duration-700 group-hover:scale-103"
              src={product.image}
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[32px] bg-black/40 p-3 rounded-full backdrop-blur-sm shadow-md">
                zoom_in
              </span>
            </div>
            
            {/* Wishlist Toggle Heart Badge */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              className="absolute top-4 right-4 bg-white/95 p-3 rounded-full text-secondary hover:scale-105 active:scale-95 shadow-md transition-all cursor-pointer z-10 border-none flex items-center justify-center"
              aria-label="Toggle favorite"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: `'FILL' ${isWishlisted ? "1" : "0"}` }}>
                favorite
              </span>
            </button>
          </div>
          <p className="text-[10px] text-center text-on-surface-variant font-medium">Click image to expand and view in full-screen gallery</p>
        </div>

        {/* Right: Product details and variations */}
        <div className="flex flex-col space-y-8 pl-0 md:pl-8">
          
          {/* Title, Category & Price */}
          <div className="space-y-4 border-b border-outline-variant pb-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-fixed-dim text-on-primary-fixed-variant font-label-md text-[11px] font-bold uppercase tracking-wider">
              {product.tag || product.category}
            </div>
            <h1 className="font-display-lg text-3xl md:text-4xl text-on-surface tracking-tight leading-tight">
              {product.title}
            </h1>
            <div className="flex items-center gap-2">
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
              <span className="text-xs text-on-surface-variant font-semibold">
                {product.rating} ({productReviews.length} reviews)
              </span>
            </div>
            
            <p className="font-headline-md text-2xl text-secondary font-bold">
              {formatPrice(basePrice)} 
              {product.id === "wedding-invitation-suite" && <span className="font-body-md text-xs text-on-surface-variant font-normal ml-1">/ set of 150</span>}
              {product.id === "custom-gold-foil-cards" && <span className="font-body-md text-xs text-on-surface-variant font-normal ml-1">/ deck of 50</span>}
            </p>
          </div>

          {/* Interactive Variant Curation Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4 border-b border-outline-variant pb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Configure Options</h3>
              <div className="space-y-4">
                {product.variants.map((v) => (
                  <div key={v.name} className="space-y-1.5">
                    <span className="text-xs text-on-surface-variant font-semibold">{v.name}:</span>
                    <div className="flex flex-wrap gap-2">
                      {v.options.map((option) => {
                        const active = selectedVariants[v.name] === option;
                        return (
                          <button
                            key={option}
                            onClick={() => handleSelectOption(v.name, option)}
                            className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer border-none transition-all ${
                              active
                                ? "bg-primary text-on-primary shadow-sm font-bold"
                                : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabbed Info Details */}
          <div className="space-y-4 border-b border-outline-variant pb-6">
            <div className="flex border-b border-outline-variant/30 text-xs font-bold uppercase tracking-wider gap-6">
              {[
                { id: "details", label: "Curation Details" },
                { id: "specs", label: "Specifications" },
                { id: "shipping", label: "Shipping & Return" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 border-b-2 cursor-pointer transition-colors border-none bg-transparent ${
                    activeTab === tab.id
                      ? "text-primary border-primary font-bold"
                      : "text-on-surface-variant border-transparent hover:text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="text-xs text-on-surface-variant leading-relaxed">
              {activeTab === "details" && (
                <p>{product.detailedDescription || product.description}</p>
              )}
              {activeTab === "specs" && (
                <ul className="space-y-1.5">
                  {product.specifications?.map((spec) => (
                    <li key={spec.name} className="grid grid-cols-3">
                      <span className="font-semibold text-on-surface">{spec.name}:</span>
                      <span className="col-span-2">{spec.value}</span>
                    </li>
                  ))}
                  {(!product.specifications || product.specifications.length === 0) && (
                    <li>Standard casino-grade paper and foil finish.</li>
                  )}
                </ul>
              )}
              {activeTab === "shipping" && (
                <p>
                  Bespoke items take time to curate. Production queue plans take 2-4 business days. Standard shipping delivers in 7-10 business days. Returns on customized stationery are generally not supported, but we offer full reprints in case of logistics damage.
                </p>
              )}
            </div>
          </div>

          {/* Customization notes and quantity inputs */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label
                className="block text-xs font-bold uppercase tracking-wider text-on-surface"
                htmlFor="customization"
              >
                Customization details
              </label>
              <textarea
                className="w-full bg-surface-container-lowest border border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-4 text-xs placeholder-on-surface-variant/40"
                id="customization"
                name="customization"
                value={customization}
                onChange={(e) => setCustomization(e.target.value)}
                placeholder="Couple initials, names, date, ink colors or backing details..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <label
                className="block text-xs font-bold uppercase tracking-wider text-on-surface"
                htmlFor="qty"
              >
                Quantity {product.id === "wedding-invitation-suite" ? "(Sets of 150)" : ""}
              </label>
              <div className="flex items-center border border-outline rounded-lg w-32 bg-surface-container-lowest overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2 text-on-surface-variant hover:bg-surface-container cursor-pointer flex items-center justify-center border-none"
                >
                  <span className="material-symbols-outlined text-[16px]">remove</span>
                </button>
                <span className="w-full text-center text-xs font-semibold text-on-surface">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((prev) => prev + 1)}
                  className="px-4 py-2 text-on-surface-variant hover:bg-surface-container cursor-pointer flex items-center justify-center border-none"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
              {product.stock <= 20 && (
                <p className="text-[10px] text-error font-bold flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[12px]">warning</span>
                  Low Stock: Only {product.stock} items left in stock.
                </p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addedFeedback}
                className={`w-full h-12 rounded-lg flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm active:scale-[0.98] cursor-pointer border-none ${
                  addedFeedback
                    ? "bg-secondary text-on-secondary"
                    : "bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container hover:shadow-md"
                }`}
              >
                <span className="material-symbols-outlined">
                  {addedFeedback ? "check_circle" : "shopping_bag"}
                </span>
                {addedFeedback ? "Added to Bag!" : `Add to Bag - ${formatPrice(totalPrice)}`}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Recommended Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-outline-variant/30 pt-16">
          <h2 className="font-headline-sm text-xl text-primary text-center mb-10 uppercase tracking-widest font-bold">
            Recommended Selections
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigateTo("product-detail", p.id)}
                className="border border-outline-variant/10 rounded-xl bg-surface-container-lowest overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer group"
              >
                <div className="aspect-[4/5] bg-surface-container overflow-hidden relative">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <span className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest font-bold">
                    {p.category}
                  </span>
                  <h4 className="font-semibold text-primary mt-1 group-hover:underline line-clamp-1">
                    {p.title}
                  </h4>
                  <p className="font-bold text-secondary text-sm mt-1">
                    {p.currency === "INR" ? `₹${(p.price || 0).toLocaleString()}` : `$${(p.price || 0).toFixed(2)}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews list & write review */}
      <section className="mt-24 border-t border-outline-variant/30 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-headline-sm text-lg text-primary mb-6 flex items-center gap-2 font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined">reviews</span>
            Customer Reviews ({productReviews.length})
          </h2>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {productReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-xl border border-outline-variant/20 bg-surface-container-low/40 space-y-2 text-xs"
              >
                <div className="flex justify-between items-center">
                  <p className="font-bold text-on-surface">{rev.author}</p>
                  <p className="text-on-surface-variant font-mono text-[10px]">{rev.date}</p>
                </div>
                <div className="flex text-secondary">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span
                      key={idx}
                      className="material-symbols-outlined text-[14px]"
                      style={{ fontVariationSettings: `'FILL' ${idx < rev.rating ? "1" : "0"}` }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="text-on-surface-variant leading-relaxed text-sm">{rev.comment}</p>
              </div>
            ))}
            {productReviews.length === 0 && (
              <div className="text-center py-8 text-on-surface-variant">
                <span className="material-symbols-outlined text-[36px] text-outline mb-2">rate_review</span>
                <p className="font-semibold text-sm">No reviews yet</p>
                <p className="text-[11px] mt-0.5">Be the first to share your bespoke experience!</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 bg-surface-container-low p-6 rounded-xl border border-outline-variant/25 h-fit">
          <h3 className="font-headline-sm text-sm text-primary mb-4 uppercase tracking-wider font-bold">Write a Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-on-surface-variant">Your Name</label>
              <input
                type="text"
                required
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="e.g. Aanya Sharma"
                className="w-full p-2.5 border border-outline rounded-lg bg-surface-container-lowest text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-on-surface-variant">Rating</label>
              <div className="flex gap-1.5 text-secondary">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReviewRating(idx + 1)}
                    className="cursor-pointer hover:scale-110 active:scale-95 transition-transform border-none bg-transparent"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: `'FILL' ${idx < reviewRating ? "1" : "0"}` }}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-on-surface-variant">Review Description</label>
              <textarea
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with foil precision, custom letterpress paper weight..."
                rows={4}
                className="w-full p-2.5 border border-outline rounded-lg bg-surface-container-lowest text-xs placeholder-on-surface-variant/40"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-on-primary py-2.5 rounded-lg font-bold hover:bg-primary-container transition-colors cursor-pointer border-none"
            >
              Submit Review
            </button>
          </form>
        </div>
      </section>

      {/* Full-Screen Lightbox Gallery */}
      <AnimatePresence>
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-zoom-out"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative max-w-4xl max-h-[85vh] p-2 z-10"
            >
              <img
                src={product.image}
                alt={product.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute -top-12 right-0 text-white hover:text-secondary flex items-center gap-1 cursor-pointer border-none bg-transparent font-bold text-xs"
              >
                Close Gallery
                <span className="material-symbols-outlined">close</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ProductDetailPage;
