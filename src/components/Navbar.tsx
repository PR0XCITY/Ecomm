import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { MiniCartDrawer } from "./MiniCartDrawer";

export const Navbar: React.FC = () => {
  const { cart, wishlist, navigateTo, activePage, cartDrawerOpen, setCartDrawerOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleNavClick = (category: string) => {
    setMobileMenuOpen(false);
    if (category === "Home") {
      navigateTo("home");
    } else if (category === "Our Story") {
      navigateTo("home");
      setTimeout(() => {
        const stories = document.getElementById("testimonials");
        if (stories) {
          stories.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      navigateTo("shop", category);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigateTo("shop", `search:${searchQuery.trim()}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav className="bg-surface shadow-sm w-full top-0 sticky z-40 transition-all duration-300 border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-base max-w-container-max mx-auto h-16">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick("Home")}
            className="font-display-lg text-display-lg text-primary tracking-tight scale-95 active:scale-90 transition-transform text-left cursor-pointer hover:opacity-90 border-none bg-transparent"
          >
            Shuffling Smiles
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 font-body-md text-body-md">
            <button
              onClick={() => handleNavClick("Wedding Stationery")}
              className={`pb-0.5 border-b-2 transition-all duration-300 cursor-pointer border-none bg-transparent ${
                activePage === "shop" && localStorage.getItem("selectedCategory") === "Wedding Stationery"
                  ? "text-primary border-primary font-semibold"
                  : "text-on-surface-variant border-transparent hover:text-primary hover:opacity-80"
              }`}
            >
              Wedding
            </button>
            <button
              onClick={() => handleNavClick("Playing Cards")}
              className={`pb-0.5 border-b-2 transition-all duration-300 cursor-pointer border-none bg-transparent ${
                activePage === "shop" && localStorage.getItem("selectedCategory") === "Playing Cards"
                  ? "text-primary border-primary font-semibold"
                  : "text-on-surface-variant border-transparent hover:text-primary hover:opacity-80"
              }`}
            >
              Playing Cards
            </button>
            <button
              onClick={() => handleNavClick("Badges")}
              className={`pb-0.5 border-b-2 transition-all duration-300 cursor-pointer border-none bg-transparent ${
                activePage === "shop" && localStorage.getItem("selectedCategory") === "Badges"
                  ? "text-primary border-primary font-semibold"
                  : "text-on-surface-variant border-transparent hover:text-primary hover:opacity-80"
              }`}
            >
              Bespoke
            </button>
            <button
              onClick={() => handleNavClick("Our Story")}
              className="text-on-surface-variant pb-0.5 border-b-2 border-transparent hover:text-primary hover:opacity-80 transition-all duration-300 cursor-pointer border-none bg-transparent"
            >
              Our Story
            </button>
          </div>

          {/* Trailing Icons */}
          <div className="flex items-center gap-2 md:gap-3 text-primary">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="scale-95 active:scale-90 transition-transform hover:opacity-80 duration-300 p-2 rounded-full hover:bg-surface-container/50 cursor-pointer border-none bg-transparent"
            >
              <span className="material-symbols-outlined text-[24px]">search</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigateTo("account", "wishlist")}
              aria-label="Wishlist"
              className="scale-95 active:scale-90 transition-transform hover:opacity-80 duration-300 p-2 rounded-full hover:bg-surface-container/50 relative cursor-pointer border-none bg-transparent"
            >
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: `'FILL' ${wishlistCount > 0 ? "1" : "0"}` }}>
                favorite
              </span>
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full"></span>
              )}
            </button>

            {/* Shopping Bag */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              aria-label="Shopping Bag"
              className="scale-95 active:scale-90 transition-transform hover:opacity-80 duration-300 p-2 rounded-full hover:bg-surface-container/50 relative cursor-pointer border-none bg-transparent"
            >
              <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
              {cartItemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full"></span>
              )}
            </button>

            {/* User Profile */}
            <button
              onClick={() => navigateTo("account")}
              aria-label="User Profile / Dashboard"
              className={`scale-95 active:scale-90 transition-transform hover:opacity-80 duration-300 p-2 rounded-full hover:bg-surface-container/50 cursor-pointer border-none bg-transparent ${
                activePage === "account" ? "bg-secondary-container text-on-secondary-container" : ""
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">person</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              className="md:hidden scale-95 active:scale-90 transition-transform hover:opacity-80 duration-300 p-2 rounded-full hover:bg-surface-container/50 cursor-pointer border-none bg-transparent"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden bg-surface border-t border-outline-variant/20 px-margin-mobile py-4 flex flex-col gap-4 shadow-md font-body-md overflow-hidden"
            >
              <button
                onClick={() => handleNavClick("Wedding Stationery")}
                className="text-left py-2 text-on-surface-variant hover:text-primary cursor-pointer border-b border-outline-variant/10 border-none bg-transparent"
              >
                Wedding
              </button>
              <button
                onClick={() => handleNavClick("Playing Cards")}
                className="text-left py-2 text-on-surface-variant hover:text-primary cursor-pointer border-b border-outline-variant/10 border-none bg-transparent"
                >
                Playing Cards
              </button>
              <button
                onClick={() => handleNavClick("Badges")}
                className="text-left py-2 text-on-surface-variant hover:text-primary cursor-pointer border-b border-outline-variant/10 border-none bg-transparent"
              >
                Bespoke
              </button>
              <button
                onClick={() => handleNavClick("Our Story")}
                className="text-left py-2 text-on-surface-variant hover:text-primary cursor-pointer border-none bg-transparent"
              >
                Our Story
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mini Cart Drawer */}
      <MiniCartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />

      {/* Search Modal Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex justify-center items-start pt-24 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-surface w-full max-w-xl rounded-xl p-6 shadow-2xl border border-outline-variant/30 relative z-10"
            >
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-primary p-2 cursor-pointer border-none bg-transparent"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <h3 className="font-headline-sm text-primary mb-4">Search Catalog</h3>
              <form onSubmit={handleSearchSubmit} className="flex gap-3">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-grow p-3 border border-outline rounded-lg bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-body-md"
                />
                <button
                  type="submit"
                  className="bg-primary text-on-primary px-6 rounded-lg font-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer border-none"
                >
                  Search
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
export default Navbar;
