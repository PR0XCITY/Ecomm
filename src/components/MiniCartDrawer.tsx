import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../context/AppContext";

interface MiniCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MiniCartDrawer: React.FC<MiniCartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, updateCartQuantity, removeFromCart, cartTotal, cartCurrency, navigateTo } = useApp();

  const handleCheckoutClick = () => {
    onClose();
    navigateTo("checkout");
  };

  const formatPrice = (value: number, currency: "INR" | "USD") => {
    return currency === "INR" ? `₹ ${value.toLocaleString()}` : `$${value.toFixed(2)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden text-left">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Slide-in Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
              className="w-screen max-w-md bg-surface border-l border-outline-variant/30 flex flex-col shadow-2xl relative"
            >
              {/* Header */}
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">shopping_bag</span>
                  <h2 className="font-headline-sm text-headline-sm text-primary">Shopping Bag</h2>
                  <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="text-on-surface-variant hover:text-primary p-2 -mr-2 cursor-pointer rounded-full hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center text-center opacity-70">
                    <span className="material-symbols-outlined text-[64px] text-outline mb-4">
                      shopping_cart_off
                    </span>
                    <h3 className="font-headline-sm text-primary mb-1">Your bag is empty</h3>
                    <p className="font-body-md text-sm text-on-surface-variant max-w-xs">
                      Browse our curated wedding stationery and custom playing cards to start adding memories.
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm relative group"
                    >
                      <div className="w-20 h-24 bg-surface-container rounded-lg overflow-hidden shrink-0">
                        <img className="w-full h-full object-cover" alt={item.title} src={item.image} />
                      </div>
                      <div className="flex-grow flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-body-md font-semibold text-primary line-clamp-1">
                              {item.title}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-outline hover:text-error cursor-pointer p-0.5"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                          </div>
                          {item.customization && (
                            <p className="text-xs text-on-surface-variant mt-1 italic">
                              Note: {item.customization}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity control */}
                          <div className="flex items-center border border-outline-variant rounded-md overflow-hidden bg-surface-container-lowest">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 10)}
                              className="px-2 py-1 text-on-surface-variant hover:text-primary cursor-pointer text-xs flex items-center justify-center"
                            >
                              <span className="material-symbols-outlined text-[14px]">remove</span>
                            </button>
                            <span className="px-2 text-center text-xs font-semibold text-on-surface">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 10)}
                              className="px-2 py-1 text-on-surface-variant hover:text-primary cursor-pointer text-xs flex items-center justify-center"
                            >
                              <span className="material-symbols-outlined text-[14px]">add</span>
                            </button>
                          </div>
                          <span className="font-body-md font-semibold text-secondary">
                            {formatPrice(item.price * item.quantity, item.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Summary Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-outline-variant/20 bg-surface-container-low space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="font-body-md font-semibold text-on-surface">Subtotal</span>
                    <span className="font-headline-sm text-headline-sm text-primary">
                      {formatPrice(cartTotal, cartCurrency)}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Taxes and shipping are calculated at checkout.
                  </p>
                  <button
                    onClick={handleCheckoutClick}
                    className="w-full bg-primary text-on-primary py-3.5 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md active:scale-[0.98] cursor-pointer border-none"
                  >
                    Proceed to Checkout
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default MiniCartDrawer;
