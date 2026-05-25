import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { mockProducts } from "../mock/mockData";

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    cartCurrency,
    navigateTo,
    addToCart,
    coupons,
    addToast,
    catalog
  } = useApp();

  // Shipping Estimator State
  const [estCountry, setEstCountry] = useState("India");
  const [estZip, setEstZip] = useState("");
  const [showEstimate, setShowEstimate] = useState(false);

  // Load default mockup items if cart is empty on mount
  useEffect(() => {
    if (cart.length === 0) {
      const invite = mockProducts.find((p) => p.id === "wedding-invitation-suite");
      const cards = mockProducts.find((p) => p.id === "custom-gold-foil-cards");

      if (invite) {
        addToCart(invite, 150, "Size: A5 Suite | Paper Weight: 600gsm Cotton [Monogram: Aarav & Priya]");
      }
      if (cards) {
        addToCart(cards, 50, "Foil Color: Gold Foil | Card Finish: Premium Linen [Monogram: A&P]");
      }
    }
  }, []);

  const formatPrice = (value: number, currency: "INR" | "USD") => {
    return currency === "INR"
      ? `₹ ${value.toLocaleString()}`
      : `$${value.toFixed(2)}`;
  };

  const handleEstimateCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (estZip.trim().length >= 5) {
      setShowEstimate(true);
      addToast("Shipping rates updated successfully!", "success");
    } else {
      addToast("Please enter a valid Zip/PIN code.", "error");
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    addToast(`Coupon "${code}" copied to clipboard!`, "success");
  };

  // Cross-sell recommendations (exclude items already in cart)
  const cartProductIds = cart.map((i) => i.productId);
  const recommendations = catalog
    .filter((p) => !cartProductIds.includes(p.id))
    .slice(0, 3);

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16 text-left">
      
      {/* Page Header */}
      <header className="mb-12 text-center">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-2">
          Your Shopping Bag
        </h1>
        <p className="font-body-md text-sm text-on-surface-variant">
          Review your bespoke selections before place order coordination.
        </p>
      </header>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-low rounded-xl border border-outline-variant/30 max-w-xl mx-auto">
          <span className="material-symbols-outlined text-[48px] text-outline mb-4">shopping_cart_off</span>
          <h3 className="font-headline-sm text-primary mb-2">Your bag is empty</h3>
          <p className="font-body-md text-xs text-on-surface-variant mb-6">
            Explore our collections and add some items to your bag.
          </p>
          <button
            onClick={() => navigateTo("shop")}
            className="bg-primary text-on-primary px-8 py-3 rounded-full font-label-md text-xs hover:bg-primary-container transition-colors cursor-pointer border-none"
          >
            Go Shop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
          
          {/* Cart Items List (Col 8) */}
          <section aria-label="Cart Items" className="lg:col-span-8 flex flex-col gap-6">
            {cart.map((item) => {
              let originalPriceFormatted = "";
              let isInvite = item.productId === "wedding-invitation-suite";
              
              if (isInvite) {
                const inviteRatio = item.quantity / 150;
                const originalPrice = 45000 * inviteRatio;
                originalPriceFormatted = `₹ ${originalPrice.toLocaleString()}`;
              }

              return (
                <article
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-6 p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm relative"
                >
                  {/* Thumbnail */}
                  <div className="w-full sm:w-36 h-44 flex-shrink-0 bg-surface-container rounded-lg overflow-hidden relative">
                    <img
                      alt={item.title}
                      className="w-full h-full object-cover"
                      src={item.image}
                    />
                  </div>
                  {/* Details & Controls */}
                  <div className="flex flex-col flex-grow justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-headline-sm text-base text-primary mb-1 font-bold">
                          {item.title}
                        </h3>
                        <p className="font-body-md text-xs text-on-surface-variant mb-4">
                          {isInvite
                            ? "Includes Invitation, RSVP, Details Enclosure, and Wax Sealed Envelope."
                            : "Premium cardstock with gold foil edges. Perfect for wedding favors."}
                        </p>
                        
                        {/* Customization Details */}
                        {item.customization && (
                          <div className="inline-flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-full border border-outline-variant">
                            <span className="material-symbols-outlined text-[14px] text-primary">edit_note</span>
                            <span className="font-label-md text-[10px] text-on-surface-variant">
                              Selected: "{item.customization}"
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                        className="text-outline hover:text-error transition-colors p-1 cursor-pointer border-none bg-transparent"
                      >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                      </button>
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden h-9 bg-surface-container-lowest">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 10)}
                          aria-label="Decrease quantity"
                          className="w-9 h-full hover:bg-surface-container text-on-surface flex items-center justify-center transition-colors cursor-pointer border-none"
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="w-10 text-center font-body-md text-xs text-on-surface border-x border-outline-variant py-2">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 10)}
                          aria-label="Increase quantity"
                          className="w-9 h-full hover:bg-surface-container text-on-surface flex items-center justify-center transition-colors cursor-pointer border-none"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>
                      <div className="text-right">
                        {isInvite && originalPriceFormatted && (
                          <span className="block font-label-md text-xs text-on-surface-variant line-through mb-0.5 opacity-70">
                            {originalPriceFormatted}
                          </span>
                        )}
                        <span className="block font-headline-sm text-base text-primary font-bold">
                          {formatPrice(item.price * item.quantity, item.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Order Summary & Tool Cards (Col 4) */}
          <aside aria-label="Order Summary" className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* Cost Summary Box */}
            <div className="bg-surface-container-low p-6 md:p-8 rounded-xl border border-outline-variant/20 shadow-sm">
              <h2 className="font-headline-sm text-lg text-primary border-b border-outline-variant/20 pb-3 mb-6 font-bold uppercase tracking-wider">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6 text-xs text-on-surface">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-bold">{formatPrice(cartTotal, cartCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Estimation</span>
                  <span className="text-on-surface-variant font-medium">Calculated below</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span className="text-on-surface-variant font-medium">Calculated at checkout</span>
                </div>
              </div>
              <div className="border-t border-outline-variant/20 pt-5 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-primary">Subtotal Due</span>
                  <span className="font-display-lg text-xl text-primary font-bold">
                    {formatPrice(cartTotal, cartCurrency)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigateTo("checkout")}
                className="w-full bg-primary text-on-primary py-3.5 px-6 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-all shadow active:scale-[0.98] cursor-pointer border-none"
              >
                Proceed to Checkout
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* Shipping Estimator Widget */}
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/20 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                Estimate Shipping
              </h3>
              <form onSubmit={handleEstimateCalculate} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={estCountry}
                    onChange={(e) => setEstCountry(e.target.value)}
                    className="p-2 border border-outline rounded-lg bg-surface-lowest text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="Zip/PIN code"
                    value={estZip}
                    onChange={(e) => setEstZip(e.target.value)}
                    className="p-2 border border-outline rounded-lg bg-surface-lowest text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary py-2 rounded-lg text-xs font-semibold cursor-pointer border-none transition-colors"
                >
                  Calculate Rates
                </button>
              </form>

              {showEstimate && (
                <div className="bg-surface-lowest p-3 rounded-lg border border-outline-variant/20 text-[11px] text-on-surface-variant space-y-2 mt-2">
                  <div className="flex justify-between font-semibold text-primary">
                    <span>Standard Shipping:</span>
                    <span>{cartTotal >= 5000 ? "FREE" : "₹ 300"}</span>
                  </div>
                  <p className="opacity-75">Delivered in 7-10 business days.</p>
                  <div className="flex justify-between font-semibold text-primary border-t border-outline-variant/10 pt-2">
                    <span>Express Shipping:</span>
                    <span>₹ 600</span>
                  </div>
                  <p className="opacity-75">Delivered in 3-5 business days.</p>
                </div>
              )}
            </div>

            {/* Coupons Showcase */}
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/20 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">local_offer</span>
                Active Offers
              </h3>
              <div className="space-y-2.5">
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    onClick={() => handleCopyCode(c.code)}
                    className="border border-dashed border-secondary/50 p-2.5 rounded-lg bg-secondary/5 flex justify-between items-center cursor-pointer hover:bg-secondary/10 transition-colors"
                  >
                    <div>
                      <p className="font-mono text-xs font-bold text-primary">{c.code}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">
                        {c.discountType === "percent" ? `${c.discountValue}% Off` : `₹${c.discountValue} Off`}{" "}
                        (Min: ₹{c.minOrderValue})
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-secondary">content_copy</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Recommended Selections (Cross-sell) */}
      {cart.length > 0 && recommendations.length > 0 && (
        <section className="mt-20 border-t border-outline-variant/30 pt-16">
          <h2 className="font-headline-sm text-xl text-primary text-center mb-10 uppercase tracking-widest font-bold">
            Complete the Suite
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((p) => (
              <div
                key={p.id}
                onClick={() => navigateTo("product-detail", p.id)}
                className="border border-outline-variant/10 rounded-xl bg-surface-container-lowest overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer group"
              >
                <div className="aspect-[4/5] bg-surface-container overflow-hidden relative">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest font-bold">
                      {p.category}
                    </span>
                    <h4 className="font-semibold text-primary mt-0.5 group-hover:underline line-clamp-1 text-sm">
                      {p.title}
                    </h4>
                    <p className="font-bold text-secondary text-xs mt-1">
                      {p.currency === "INR" ? `₹${p.price.toLocaleString()}` : `$${p.price.toFixed(2)}`}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p, 1, "Default Monogram");
                    }}
                    className="w-full bg-primary text-on-primary py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider mt-4 hover:bg-primary-container transition-colors cursor-pointer border-none flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">shopping_bag</span>
                    Quick Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
export default CartPage;
