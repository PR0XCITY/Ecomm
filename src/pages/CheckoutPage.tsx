import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    cartTotal,
    cartCurrency,
    user,
    updateUser,
    coupons,
    placeOrder,
    navigateTo,
    addToast,
    addLog,
  } = useApp();

  const [step, setStep] = useState(1);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  
  // Shipping State
  const [selectedAddressId, setSelectedAddressId] = useState(
    user.addresses.find((a) => a.isDefault)?.id || user.addresses[0]?.id || "new"
  );
  const [customAddress, setCustomAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });
  const [saveNewAddress, setSaveNewAddress] = useState(true);

  // Delivery State
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express" | "overnight">("standard");

  // Payment State
  const [selectedCardId, setSelectedCardId] = useState(
    user.paymentMethods[0]?.id || "new"
  );
  const [customCard, setCustomCard] = useState({
    cardholder: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [saveNewCard, setSaveNewCard] = useState(true);

  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-fill custom fields on mount if user profile is available
  useEffect(() => {
    if (user) {
      setCustomAddress({
        name: user.name,
        street: "",
        city: "",
        state: "",
        zip: "",
        country: cartCurrency === "USD" ? "United States" : "India",
      });
      setCustomCard({
        cardholder: user.name,
        number: "",
        expiry: "",
        cvv: "",
      });
    }
  }, [user, cartCurrency]);

  // If cart is empty, redirect back to Shop unless we are on processing or finished
  useEffect(() => {
    if (cart.length === 0 && !isProcessing && step < 5) {
      addToast("Your shopping bag is empty.", "info");
      navigateTo("shop");
    }
  }, [cart, navigateTo]);

  // Calculate pricing values
  const getShippingCost = () => {
    const isUSD = cartCurrency === "USD";
    if (deliveryMethod === "standard") {
      // Free standard shipping for orders above ₹5000 or $100
      if (cartTotal >= (isUSD ? 100 : 5000)) return 0;
      return isUSD ? 10 : 300;
    }
    if (deliveryMethod === "express") {
      return isUSD ? 20 : 600;
    }
    // Overnight
    return isUSD ? 35 : 1000;
  };

  const getTaxRate = () => {
    return cartCurrency === "USD" ? 0.08 : 0.18; // 8% for USD, 18% GST for INR
  };

  const getCouponDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.minOrderValue && cartTotal < appliedCoupon.minOrderValue) {
      return 0; // doesn't meet minimum order value
    }
    if (appliedCoupon.discountType === "percent") {
      return (cartTotal * appliedCoupon.discountValue) / 100;
    }
    return appliedCoupon.discountValue; // fixed value discount
  };

  const shippingCost = getShippingCost();
  const taxRate = getTaxRate();
  const discountAmount = getCouponDiscount();
  const taxableAmount = Math.max(0, cartTotal - discountAmount);
  const calculatedTax = Math.round(taxableAmount * taxRate * 100) / 100;
  const finalTotal = Math.max(0, taxableAmount + shippingCost + calculatedTax);

  const formatPrice = (value: number) => {
    return cartCurrency === "INR"
      ? `₹${value.toLocaleString()}`
      : `$${value.toFixed(2)}`;
  };

  // Card details formatter
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").substring(0, 16);
    const formatted = val.replace(/(.{4})/g, "$1 ").trim();
    setCustomCard({ ...customCard, number: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").substring(0, 4);
    let formatted = val;
    if (val.length >= 2) {
      formatted = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
    }
    setCustomCard({ ...customCard, expiry: formatted });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").substring(0, 4);
    setCustomCard({ ...customCard, cvv: val });
  };

  // Coupon Handlers
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const found = coupons.find(
      (c) => c.code.toLowerCase() === couponCode.trim().toLowerCase() && c.active
    );

    if (found) {
      if (cartTotal < found.minOrderValue) {
        addToast(
          `Code requires a minimum purchase of ${formatPrice(found.minOrderValue)}`,
          "error"
        );
        return;
      }
      setAppliedCoupon(found);
      addToast(`Promo code "${found.code}" applied!`, "success");
      addLog(`Checkout: Applied promo coupon "${found.code}"`);
    } else {
      addToast("Invalid or expired coupon code.", "error");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    addToast("Promo code removed.", "info");
  };

  // Step Navigations
  const nextStep = () => {
    if (step === 2) {
      // Validate Shipping details
      if (selectedAddressId === "new") {
        const { name, street, city, state, zip } = customAddress;
        if (!name.trim() || !street.trim() || !city.trim() || !state.trim() || !zip.trim()) {
          addToast("Please fill in all shipping fields.", "error");
          return;
        }
      }
    }
    if (step === 4) {
      // Validate Payment details
      if (selectedCardId === "new") {
        const { cardholder, number, expiry, cvv } = customCard;
        if (!cardholder.trim() || number.replace(/\s/g, "").length < 15 || expiry.length < 5 || cvv.length < 3) {
          addToast("Please enter valid card information.", "error");
          return;
        }
      }
    }
    setStep((prev) => Math.min(5, prev + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Final Submission
  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // 1. Determine address details
    let finalAddress: any = null;
    if (selectedAddressId === "new") {
      finalAddress = {
        id: `addr-${Date.now()}`,
        name: customAddress.name,
        street: customAddress.street,
        city: customAddress.city,
        state: customAddress.state,
        zip: customAddress.zip,
        country: customAddress.country,
        isDefault: user.addresses.length === 0,
      };

      if (saveNewAddress) {
        const updatedUser = {
          ...user,
          addresses: [...user.addresses, finalAddress],
        };
        updateUser(updatedUser);
        addLog(`Account: Saved new shipping address "${finalAddress.name}"`);
      }
    } else {
      finalAddress = user.addresses.find((a) => a.id === selectedAddressId);
    }

    // 2. Determine card payment details
    let paymentText = "";
    if (selectedCardId === "new") {
      const maskedNum = `•••• •••• •••• ${customCard.number.slice(-4)}`;
      paymentText = `${getCardBrand(customCard.number)} ending ${customCard.number.slice(-4)}`;

      if (saveNewCard) {
        const newCard = {
          id: `card-${Date.now()}`,
          cardholder: customCard.cardholder,
          number: maskedNum,
          expiry: customCard.expiry,
          cvv: "•••",
          brand: getCardBrand(customCard.number),
        };
        const updatedUser = {
          ...user,
          paymentMethods: [...user.paymentMethods, newCard],
        };
        updateUser(updatedUser);
        addLog(`Account: Saved new payment card ending in ${customCard.number.slice(-4)}`);
      }
    } else {
      const card = user.paymentMethods.find((c) => c.id === selectedCardId);
      paymentText = card ? `${card.brand} ending ${card.number.slice(-4)}` : "Saved Card Details";
    }

    // 3. Simulate API post delay
    setTimeout(() => {
      setIsProcessing(false);
      // Place order and navigate to order confirmation inside context
      placeOrder(
        finalAddress ? finalAddress.name : user.name,
        paymentText,
        cart,
        finalTotal
      );
    }, 2000);
  };

  const getCardBrand = (num: string) => {
    const cleanNum = num.replace(/\s/g, "");
    if (cleanNum.startsWith("4")) return "Visa";
    if (/^5[1-5]/.test(cleanNum)) return "Mastercard";
    if (/^3[47]/.test(cleanNum)) return "American Express";
    return "Credit Card";
  };

  // UI components
  const renderStepIndicator = () => {
    const steps = [
      { num: 1, label: "Bag Review" },
      { num: 2, label: "Shipping" },
      { num: 3, label: "Delivery" },
      { num: 4, label: "Payment" },
      { num: 5, label: "Confirmation" },
    ];

    return (
      <div className="mb-12 flex justify-between items-center max-w-2xl mx-auto px-4">
        {steps.map((s, idx) => (
          <React.Fragment key={s.num}>
            <div className="flex flex-col items-center relative">
              <button
                onClick={() => step > s.num && setStep(s.num)}
                disabled={step <= s.num}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-label-md transition-all duration-300 ${
                  step === s.num
                    ? "bg-primary text-on-primary ring-4 ring-primary-fixed"
                    : step > s.num
                    ? "bg-secondary text-on-secondary hover:opacity-90 cursor-pointer"
                    : "bg-surface-container-high text-on-surface-variant cursor-not-allowed"
                }`}
              >
                {step > s.num ? (
                  <span className="material-symbols-outlined text-[18px]">check</span>
                ) : (
                  s.num
                )}
              </button>
              <span
                className={`text-xs mt-2 font-semibold absolute -bottom-6 whitespace-nowrap hidden sm:inline ${
                  step === s.num ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-grow h-0.5 mx-2 transition-all duration-500 ${
                  step > s.num ? "bg-secondary" : "bg-outline-variant/30"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 text-left relative min-h-[70vh]">
      {/* Loading Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex flex-col justify-center items-center text-center text-white"
          >
            <div className="w-16 h-16 border-4 border-secondary border-t-white rounded-full animate-spin mb-6" />
            <h2 className="font-display-lg text-2xl md:text-3xl text-secondary-fixed mb-2">
              Processing Secure Payment
            </h2>
            <p className="font-body-md text-sm text-surface-container-high max-w-xs">
              Verifying your card credentials and recording your bespoke order details...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="mb-10">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary text-center">
          Secure Checkout
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant text-center mt-2">
          Verify and complete your custom e-commerce selections.
        </p>
      </header>

      {renderStepIndicator()}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start pt-6">
        {/* Step Contents (Col 8) */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant/20 shadow-sm relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* STEP 1: BAG REVIEW */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="font-headline-sm text-headline-sm text-primary border-b border-outline-variant/20 pb-3">
                    Review Your Selected Items
                  </h2>
                  <div className="divide-y divide-outline-variant/20">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                        <div className="w-16 h-20 bg-surface-container rounded overflow-hidden shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="font-body-md font-semibold text-on-surface line-clamp-1">{item.title}</h3>
                            {item.customization && (
                              <p className="text-xs text-on-surface-variant italic mt-0.5">
                                Note: "{item.customization}"
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-outline-variant rounded-md overflow-hidden bg-surface-lowest">
                              <button
                                onClick={() => updateCartQuantity(item.id, item.quantity - 10)}
                                className="px-2 py-0.5 text-on-surface hover:text-primary transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[16px]">remove</span>
                              </button>
                              <span className="px-2.5 text-xs font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.id, item.quantity + 10)}
                                className="px-2 py-0.5 text-on-surface hover:text-primary transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[16px]">add</span>
                              </button>
                            </div>
                            <span className="font-body-md font-semibold text-primary">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Validation Form */}
                  <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/20 mt-6">
                    <h3 className="font-label-md text-label-md text-primary uppercase tracking-wide mb-3">
                      Have a Promo Code?
                    </h3>
                    {appliedCoupon ? (
                      <div className="flex justify-between items-center bg-secondary/10 border border-secondary/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary">local_offer</span>
                          <span className="font-body-md text-sm text-on-surface font-semibold">
                            "{appliedCoupon.code}" Applied ({appliedCoupon.discountType === "percent" ? `${appliedCoupon.discountValue}%` : formatPrice(appliedCoupon.discountValue)} off)
                          </span>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-on-surface-variant hover:text-error text-xs cursor-pointer underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. SMILES20"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-grow p-2.5 border border-outline rounded-lg bg-surface-container-lowest focus:ring-1 focus:ring-primary focus:border-primary text-sm uppercase"
                        />
                        <button
                          type="submit"
                          className="bg-primary text-on-primary px-5 py-2 rounded-lg font-label-md text-xs hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </form>
                    )}
                    <p className="text-[11px] text-on-surface-variant mt-2">
                      Try codes: <strong className="text-primary">SMILES20</strong> (20% off orders &gt; ₹2000), <strong className="text-primary">WELCOME10</strong> (10% off no minimum).
                    </p>
                  </div>

                  <div className="pt-6 border-t border-outline-variant/20 flex justify-end">
                    <button
                      onClick={nextStep}
                      className="bg-primary text-on-primary py-3 px-8 rounded-lg font-label-md text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer flex items-center gap-2"
                    >
                      Continue to Shipping
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: SHIPPING DETAILS */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-headline-sm text-headline-sm text-primary border-b border-outline-variant/20 pb-3">
                    Shipping Details
                  </h2>

                  {/* Saved Addresses list */}
                  {user.addresses.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wide">
                        Choose a Saved Address
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.addresses.map((addr) => (
                          <label
                            key={addr.id}
                            className={`p-4 rounded-xl border flex gap-3 cursor-pointer transition-all duration-300 ${
                              selectedAddressId === addr.id
                                ? "border-primary bg-primary-fixed/20 ring-1 ring-primary shadow-sm"
                                : "border-outline-variant/40 hover:bg-surface-container-low"
                            }`}
                          >
                            <input
                              type="radio"
                              name="shipping_address"
                              value={addr.id}
                              checked={selectedAddressId === addr.id}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="mt-1 accent-primary"
                            />
                            <div className="text-xs">
                              <p className="font-bold text-on-surface flex items-center gap-1.5">
                                {addr.name}
                                {addr.isDefault && (
                                  <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px]">
                                    Default
                                  </span>
                                )}
                              </p>
                              <p className="text-on-surface-variant mt-1">{addr.street}</p>
                              <p className="text-on-surface-variant">
                                {addr.city}, {addr.state} - {addr.zip}
                              </p>
                              <p className="text-on-surface-variant font-semibold mt-1">{addr.country}</p>
                            </div>
                          </label>
                        ))}
                        <label
                          className={`p-4 rounded-xl border flex gap-3 cursor-pointer transition-all duration-300 ${
                            selectedAddressId === "new"
                              ? "border-primary bg-primary-fixed/20 ring-1 ring-primary shadow-sm"
                              : "border-outline-variant/40 hover:bg-surface-container-low"
                          }`}
                        >
                          <input
                            type="radio"
                            name="shipping_address"
                            value="new"
                            checked={selectedAddressId === "new"}
                            onChange={() => setSelectedAddressId("new")}
                            className="mt-1 accent-primary"
                          />
                          <div className="text-xs">
                            <p className="font-bold text-primary flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px]">add_location</span>
                              Add New Address
                            </p>
                            <p className="text-on-surface-variant mt-1">Specify custom shipment coordinates.</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Custom Address Form */}
                  {selectedAddressId === "new" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4 pt-4 border-t border-outline-variant/20"
                    >
                      <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wide">
                        New Shipping Address
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Contact Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Aanya Sharma"
                            value={customAddress.name}
                            onChange={(e) => setCustomAddress({ ...customAddress, name: e.target.value })}
                            className="w-full p-2.5 border border-outline rounded-lg bg-surface-container-lowest text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Country</label>
                          <select
                            value={customAddress.country}
                            onChange={(e) => setCustomAddress({ ...customAddress, country: e.target.value })}
                            className="w-full p-2.5 border border-outline rounded-lg bg-surface-container-lowest text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                          >
                            <option value="India">India</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Street Address</label>
                          <input
                            type="text"
                            required
                            placeholder="Apartment, suite, unit, building, street..."
                            value={customAddress.street}
                            onChange={(e) => setCustomAddress({ ...customAddress, street: e.target.value })}
                            className="w-full p-2.5 border border-outline rounded-lg bg-surface-container-lowest text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1 text-on-surface-variant">City</label>
                          <input
                            type="text"
                            required
                            placeholder="New Delhi"
                            value={customAddress.city}
                            onChange={(e) => setCustomAddress({ ...customAddress, city: e.target.value })}
                            className="w-full p-2.5 border border-outline rounded-lg bg-surface-container-lowest text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1 text-on-surface-variant">State / Region</label>
                          <input
                            type="text"
                            required
                            placeholder="Delhi"
                            value={customAddress.state}
                            onChange={(e) => setCustomAddress({ ...customAddress, state: e.target.value })}
                            className="w-full p-2.5 border border-outline rounded-lg bg-surface-container-lowest text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Zip / PIN Code</label>
                          <input
                            type="text"
                            required
                            placeholder="110001"
                            value={customAddress.zip}
                            onChange={(e) => setCustomAddress({ ...customAddress, zip: e.target.value })}
                            className="w-full p-2.5 border border-outline rounded-lg bg-surface-container-lowest text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          id="save_addr"
                          checked={saveNewAddress}
                          onChange={(e) => setSaveNewAddress(e.target.checked)}
                          className="accent-primary w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="save_addr" className="text-xs text-on-surface-variant select-none cursor-pointer">
                          Save this shipping address to my customer address book.
                        </label>
                      </div>
                    </motion.div>
                  )}

                  <div className="pt-6 border-t border-outline-variant/20 flex justify-between">
                    <button
                      onClick={prevStep}
                      className="border border-outline text-on-surface py-3 px-6 rounded-lg font-label-md text-sm hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="bg-primary text-on-primary py-3 px-8 rounded-lg font-label-md text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer flex items-center gap-2"
                    >
                      Delivery Options
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: DELIVERY METHOD */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="font-headline-sm text-headline-sm text-primary border-b border-outline-variant/20 pb-3">
                    Select Delivery Speed
                  </h2>

                  <div className="space-y-4">
                    {/* Standard Method */}
                    <label
                      className={`p-5 rounded-xl border flex justify-between items-center cursor-pointer transition-all duration-300 ${
                        deliveryMethod === "standard"
                          ? "border-primary bg-primary-fixed/20 ring-1 ring-primary"
                          : "border-outline-variant/40 hover:bg-surface-container-low"
                      }`}
                    >
                      <div className="flex gap-4">
                        <input
                          type="radio"
                          name="delivery_speed"
                          value="standard"
                          checked={deliveryMethod === "standard"}
                          onChange={() => setDeliveryMethod("standard")}
                          className="accent-primary self-start mt-1"
                        />
                        <div>
                          <p className="font-semibold text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-primary">local_shipping</span>
                            Standard Delivery
                          </p>
                          <p className="text-xs text-on-surface-variant mt-1">
                            Bespoke curation takes time. Delivered in 7-10 business days.
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-primary">
                        {cartTotal >= (cartCurrency === "USD" ? 100 : 5000) ? "FREE" : formatPrice(cartCurrency === "USD" ? 10 : 300)}
                      </span>
                    </label>

                    {/* Express Method */}
                    <label
                      className={`p-5 rounded-xl border flex justify-between items-center cursor-pointer transition-all duration-300 ${
                        deliveryMethod === "express"
                          ? "border-primary bg-primary-fixed/20 ring-1 ring-primary"
                          : "border-outline-variant/40 hover:bg-surface-container-low"
                      }`}
                    >
                      <div className="flex gap-4">
                        <input
                          type="radio"
                          name="delivery_speed"
                          value="express"
                          checked={deliveryMethod === "express"}
                          onChange={() => setDeliveryMethod("express")}
                          className="accent-primary self-start mt-1"
                        />
                        <div>
                          <p className="font-semibold text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-primary">rocket_launch</span>
                            Express Shipment
                          </p>
                          <p className="text-xs text-on-surface-variant mt-1">
                            Prioritized layout planning &amp; print queue. Delivered in 3-5 business days.
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-primary">
                        {formatPrice(cartCurrency === "USD" ? 20 : 600)}
                      </span>
                    </label>

                    {/* Overnight Method */}
                    <label
                      className={`p-5 rounded-xl border flex justify-between items-center cursor-pointer transition-all duration-300 ${
                        deliveryMethod === "overnight"
                          ? "border-primary bg-primary-fixed/20 ring-1 ring-primary"
                          : "border-outline-variant/40 hover:bg-surface-container-low"
                      }`}
                    >
                      <div className="flex gap-4">
                        <input
                          type="radio"
                          name="delivery_speed"
                          value="overnight"
                          checked={deliveryMethod === "overnight"}
                          onChange={() => setDeliveryMethod("overnight")}
                          className="accent-primary self-start mt-1"
                        />
                        <div>
                          <p className="font-semibold text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-primary">flash_on</span>
                            Bespoke Overnight Courier
                          </p>
                          <p className="text-xs text-on-surface-variant mt-1">
                            Instant production priority. Ships next day, delivered in 1-2 business days.
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-primary">
                        {formatPrice(cartCurrency === "USD" ? 35 : 1000)}
                      </span>
                    </label>
                  </div>

                  <div className="pt-6 border-t border-outline-variant/20 flex justify-between">
                    <button
                      onClick={prevStep}
                      className="border border-outline text-on-surface py-3 px-6 rounded-lg font-label-md text-sm hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="bg-primary text-on-primary py-3 px-8 rounded-lg font-label-md text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer flex items-center gap-2"
                    >
                      Continue to Payment
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: PAYMENT DETAILS */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="font-headline-sm text-headline-sm text-primary border-b border-outline-variant/20 pb-3">
                    Payment Details
                  </h2>

                  {/* Saved Cards List */}
                  {user.paymentMethods.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wide">
                        Select a Saved Card
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.paymentMethods.map((card) => (
                          <label
                            key={card.id}
                            className={`p-4 rounded-xl border flex gap-3 cursor-pointer transition-all duration-300 ${
                              selectedCardId === card.id
                                ? "border-primary bg-primary-fixed/20 ring-1 ring-primary shadow-sm"
                                : "border-outline-variant/40 hover:bg-surface-container-low"
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment_card"
                              value={card.id}
                              checked={selectedCardId === card.id}
                              onChange={() => setSelectedCardId(card.id)}
                              className="mt-1 accent-primary"
                            />
                            <div className="text-xs flex-grow">
                              <p className="font-bold text-on-surface flex justify-between">
                                <span>{card.brand} Credit Card</span>
                                <span className="text-[10px] text-on-surface-variant font-mono">Exp: {card.expiry}</span>
                              </p>
                              <p className="text-on-surface font-mono mt-2 tracking-widest">{card.number}</p>
                              <p className="text-on-surface-variant text-[10px] mt-1 italic">Holder: {card.cardholder}</p>
                            </div>
                          </label>
                        ))}
                        <label
                          className={`p-4 rounded-xl border flex gap-3 cursor-pointer transition-all duration-300 ${
                            selectedCardId === "new"
                              ? "border-primary bg-primary-fixed/20 ring-1 ring-primary shadow-sm"
                              : "border-outline-variant/40 hover:bg-surface-container-low"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment_card"
                            value="new"
                            checked={selectedCardId === "new"}
                            onChange={() => setSelectedCardId("new")}
                            className="mt-1 accent-primary"
                          />
                          <div className="text-xs">
                            <p className="font-bold text-primary flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px]">add_card</span>
                              Add Credit / Debit Card
                            </p>
                            <p className="text-on-surface-variant mt-1">Specify credentials for mock validation.</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Custom Card entry */}
                  {selectedCardId === "new" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4 pt-4 border-t border-outline-variant/20"
                    >
                      <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wide">
                        New Card Details
                      </h3>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Aanya Sharma"
                          value={customCard.cardholder}
                          onChange={(e) => setCustomCard({ ...customCard, cardholder: e.target.value })}
                          className="w-full p-2.5 border border-outline rounded-lg bg-surface-container-lowest text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="4111 2222 3333 4444"
                            value={customCard.number}
                            onChange={handleCardNumberChange}
                            className="w-full p-2.5 pl-10 border border-outline rounded-lg bg-surface-container-lowest text-sm focus:ring-1 focus:ring-primary focus:border-primary font-mono tracking-widest"
                          />
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                            credit_card
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Expiry Date</label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            value={customCard.expiry}
                            onChange={handleExpiryChange}
                            className="w-full p-2.5 border border-outline rounded-lg bg-surface-container-lowest text-sm focus:ring-1 focus:ring-primary focus:border-primary font-mono text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1 text-on-surface-variant">CVV / CVC</label>
                          <input
                            type="password"
                            required
                            placeholder="•••"
                            value={customCard.cvv}
                            onChange={handleCvvChange}
                            className="w-full p-2.5 border border-outline rounded-lg bg-surface-container-lowest text-sm focus:ring-1 focus:ring-primary focus:border-primary font-mono text-center"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          id="save_card"
                          checked={saveNewCard}
                          onChange={(e) => setSaveNewCard(e.target.checked)}
                          className="accent-primary w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="save_card" className="text-xs text-on-surface-variant select-none cursor-pointer">
                          Save this payment card securely inside my profile.
                        </label>
                      </div>
                    </motion.div>
                  )}

                  <div className="pt-6 border-t border-outline-variant/20 flex justify-between">
                    <button
                      onClick={prevStep}
                      className="border border-outline text-on-surface py-3 px-6 rounded-lg font-label-md text-sm hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="bg-primary text-on-primary py-3 px-8 rounded-lg font-label-md text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer flex items-center gap-2"
                    >
                      Final Review
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: FINAL ORDER REVIEW */}
              {step === 5 && (
                <div className="space-y-6">
                  <h2 className="font-headline-sm text-headline-sm text-primary border-b border-outline-variant/20 pb-3">
                    Review and Confirm Order
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-on-surface-variant">
                    {/* Shipping Address Summary */}
                    <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/15">
                      <p className="font-bold text-primary uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">pin_drop</span>
                        Shipping Location
                      </p>
                      {selectedAddressId === "new" ? (
                        <div>
                          <p className="font-semibold text-on-surface">{customAddress.name}</p>
                          <p className="mt-1">{customAddress.street}</p>
                          <p>
                            {customAddress.city}, {customAddress.state} - {customAddress.zip}
                          </p>
                          <p className="font-semibold mt-1 text-on-surface">{customAddress.country}</p>
                        </div>
                      ) : (
                        (() => {
                          const addr = user.addresses.find((a) => a.id === selectedAddressId);
                          return addr ? (
                            <div>
                              <p className="font-semibold text-on-surface">{addr.name}</p>
                              <p className="mt-1">{addr.street}</p>
                              <p>
                                {addr.city}, {addr.state} - {addr.zip}
                              </p>
                              <p className="font-semibold mt-1 text-on-surface">{addr.country}</p>
                            </div>
                          ) : (
                            <p className="text-error">No address selected.</p>
                          );
                        })()
                      )}
                    </div>

                    {/* Payment Card Summary */}
                    <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/15">
                      <p className="font-bold text-primary uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">payment</span>
                        Payment Method
                      </p>
                      {selectedCardId === "new" ? (
                        <div>
                          <p className="font-semibold text-on-surface">{customCard.cardholder}</p>
                          <p className="mt-1 font-mono tracking-wider">{getCardBrand(customCard.number)} ending {customCard.number.replace(/\s/g, "").slice(-4)}</p>
                          <p className="mt-1 font-mono text-[10px]">Expires: {customCard.expiry}</p>
                        </div>
                      ) : (
                        (() => {
                          const card = user.paymentMethods.find((c) => c.id === selectedCardId);
                          return card ? (
                            <div>
                              <p className="font-semibold text-on-surface">{card.cardholder}</p>
                              <p className="mt-1 font-mono tracking-wider">{card.brand} ending {card.number.slice(-4)}</p>
                              <p className="mt-1 font-mono text-[10px]">Expires: {card.expiry}</p>
                            </div>
                          ) : (
                            <p className="text-error">No card selected.</p>
                          );
                        })()
                      )}
                    </div>

                    {/* Delivery Summary */}
                    <div className="md:col-span-2 p-4 rounded-lg bg-surface-container-low border border-outline-variant/15 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-primary uppercase tracking-wide mb-1 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                          Selected Delivery
                        </p>
                        <p className="text-on-surface font-medium capitalize">
                          {deliveryMethod} Shipment (
                          {deliveryMethod === "standard"
                            ? "7-10 business days"
                            : deliveryMethod === "express"
                            ? "3-5 business days"
                            : "1-2 business days"}
                          )
                        </p>
                      </div>
                      <span className="font-bold text-sm text-primary">{shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}</span>
                    </div>
                  </div>

                  <div className="bg-secondary/5 border border-secondary/20 p-4 rounded-lg flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary mt-0.5">verified_user</span>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      By placing this order, you authorize the mock simulation to process the transaction amount of{" "}
                      <strong className="text-primary font-semibold">{formatPrice(finalTotal)}</strong>. High-quality print queue scheduling and packaging logs will update in real-time.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-outline-variant/20 flex justify-between">
                    <button
                      onClick={prevStep}
                      className="border border-outline text-on-surface py-3 px-6 rounded-lg font-label-md text-sm hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="bg-primary text-on-primary py-4 px-10 rounded-lg font-label-md text-sm hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center gap-2 font-bold"
                    >
                      Submit Order - {formatPrice(finalTotal)}
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar (Col 4) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="bg-surface-container-low p-6 md:p-8 rounded-xl border border-outline-variant/20 shadow-sm">
            <h2 className="font-headline-sm text-headline-sm text-primary border-b border-outline-variant/20 pb-3 mb-4">
              Cost Summary
            </h2>
            <div className="space-y-3 font-body-md text-sm text-on-surface">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Subtotal ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-secondary font-semibold">
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-medium flex items-center gap-1">
                  Shipping Cost
                  <span className="text-[10px] bg-surface-container-high px-1.5 py-0.5 rounded capitalize">
                    {deliveryMethod}
                  </span>
                </span>
                <span>{shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">
                  Est. Taxes ({cartCurrency === "USD" ? "8%" : "18% GST"})
                </span>
                <span>{formatPrice(calculatedTax)}</span>
              </div>
            </div>
            <div className="border-t border-outline-variant/20 pt-4 mt-4">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-primary">Final Total</span>
                <span className="font-headline-sm text-primary text-xl md:text-2xl font-bold">
                  {formatPrice(finalTotal)}
                </span>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-1.5 text-right italic">
                Converted to local shop parameters
              </p>
            </div>
          </div>

          {/* Secure Trust Badge */}
          <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-surface-container border border-outline-variant/10 text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-[20px] text-primary">lock</span>
            <div>
              <p className="font-bold text-primary">Secure Simulation Portal</p>
              <p className="text-[10px] mt-0.5">SSL Encrypted / Sandbox Payment Gateway</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
