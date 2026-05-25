import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import { CardSkeleton } from "../components/SkeletonLoader";
import { QuickViewModal } from "../components/QuickViewModal";

export const ShopPage: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    navigateTo,
    catalog,
    wishlist,
    toggleWishlist,
  } = useApp();

  const [selectedAesthetics, setSelectedAesthetics] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("Featured");
  const [isLoading, setIsLoading] = useState(false);
  const [quickViewId, setQuickViewId] = useState<string | null>(null);

  // Trigger simulated skeleton loading on filter/search change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedAesthetics, sortBy, searchQuery]);

  const toggleAesthetic = (aesthetic: string) => {
    setSelectedAesthetics((prev) =>
      prev.includes(aesthetic)
        ? prev.filter((a) => a !== aesthetic)
        : [...prev, aesthetic]
    );
  };

  const handleCategoryToggle = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
      setSearchQuery("");
    }
  };

  // Filter products
  const filtered = catalog.filter((product) => {
    if (!product) return false;

    // 1. Search Query Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const title = product.title || "";
      const desc = product.description || "";
      const category = product.category || "";
      const matchTitle = title.toLowerCase().includes(query);
      const matchDesc = desc.toLowerCase().includes(query);
      const matchCategory = category.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchCategory) return false;
    }

    // 2. Category Filter
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }

    // 3. Aesthetics Filter
    if (selectedAesthetics.length > 0) {
      const hasMatch = Array.isArray(product.aesthetics) && product.aesthetics.some((aes) =>
        selectedAesthetics.includes(aes)
      );
      if (!hasMatch) return false;
    }

    return true;
  });

  // Sort products
  if (sortBy === "Price: Low to High") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "New Arrivals") {
    filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  } else if (sortBy === "Featured") {
    filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
  }

  // Header texts
  let headerTitle = "All Products";
  let headerSubtitle = "Discover our handcrafted celebratory creations.";
  if (searchQuery) {
    headerTitle = `Search: "${searchQuery}"`;
    headerSubtitle = `Found ${filtered.length} products matching your query.`;
  } else if (selectedCategory) {
    headerTitle = selectedCategory;
    if (selectedCategory === "Playing Cards") {
      headerSubtitle = "Luxurious, gold-foil custom favor cards inspired by heritage patterns.";
    } else if (selectedCategory === "Wedding Stationery") {
      headerSubtitle = "Elegant invitations and suites printed on tactile cardstock.";
    } else {
      headerSubtitle = `Explore our curated list of ${selectedCategory.toLowerCase()}.`;
    }
  }

  // Trending Filter tags
  const trendingTags = [
    { label: "Bestsellers", action: () => { setSortBy("Featured"); setSelectedCategory(""); setSelectedAesthetics([]); } },
    { label: "Playing Cards", action: () => { setSelectedCategory("Playing Cards"); } },
    { label: "Wedding Stationery", action: () => { setSelectedCategory("Wedding Stationery"); } },
    { label: "Floral Aesthetics", action: () => { setSelectedAesthetics(["Floral"]); } },
    { label: "Regal Themes", action: () => { setSelectedAesthetics(["Regal"]); } },
  ];

  return (
    <div
      className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16 flex flex-col md:flex-row gap-8 lg:gap-16 text-left animate-page-fade-in"
    >

      {/* Filter Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
        <div className="sticky top-28">
          <h2 className="font-headline-sm text-headline-sm text-primary mb-6 pb-2 border-b border-outline-variant/30">
            Curated Collections
          </h2>
          <ul className="space-y-4 font-body-md text-body-md">
            {[
              { id: "Playing Cards", label: "Playing Cards" },
              { id: "Wedding Stationery", label: "Wedding Stationery" },
              { id: "Badges", label: "Badges" },
              { id: "Tic-Tac-Toe sheets", label: "Tic-Tac-Toe sheets" },
            ].map((cat) => (
              <li key={cat.id}>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCategory === cat.id}
                    onChange={() => handleCategoryToggle(cat.id)}
                    className="sr-only"
                  />
                  <div className="w-5 h-5 rounded border border-outline group-hover:border-primary flex items-center justify-center transition-colors">
                    {selectedCategory === cat.id && (
                      <div className="w-3 h-3 bg-primary rounded-sm"></div>
                    )}
                  </div>
                  <span
                    className={`transition-colors ${
                      selectedCategory === cat.id
                        ? "text-primary font-semibold"
                        : "text-on-surface-variant group-hover:text-primary"
                    }`}
                  >
                    {cat.label}
                  </span>
                </label>
              </li>
            ))}
          </ul>

          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mt-10 mb-4">
            Aesthetics
          </h3>
          <div className="flex flex-wrap gap-2">
            {["Floral", "Geometric", "Minimal", "Regal"].map((aes) => {
              const active = selectedAesthetics.includes(aes);
              return (
                <button
                  key={aes}
                  onClick={() => toggleAesthetic(aes)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-colors border-none ${
                    active
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-high text-on-surface hover:bg-primary-container hover:text-on-primary-container"
                  }`}
                >
                  {aes}
                </button>
              );
            })}
          </div>

          {(selectedCategory || selectedAesthetics.length > 0 || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("");
                setSearchQuery("");
                setSelectedAesthetics([]);
              }}
              className="mt-8 text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer border-none bg-transparent"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              Clear All Filters
            </button>
          )}
        </div>
      </aside>

      {/* Product Grid Section */}
      <section className="flex-grow">
        {/* Trending Tags Ribbon */}
        <div className="flex flex-wrap gap-2 items-center mb-8 border-b border-outline-variant/10 pb-4">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mr-2">Trending:</span>
          {trendingTags.map((tag) => (
            <button
              key={tag.label}
              onClick={tag.action}
              className="px-3 py-1 bg-surface-container rounded-full text-[10px] font-semibold text-on-surface hover:text-primary hover:bg-primary-container/20 cursor-pointer border-none"
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-1">Shop</p>
            <h1 className="font-headline-md text-headline-md text-primary leading-tight">{headerTitle}</h1>
            <p className="font-body-md text-xs text-on-surface-variant mt-2 max-w-xl">
              {headerSubtitle}
            </p>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant font-body-md text-sm shrink-0">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-primary font-medium focus:ring-0 cursor-pointer p-0 pr-4 text-xs font-semibold"
            >
              <option value="Featured">Featured</option>
              <option value="New Arrivals">New Arrivals</option>
              <option value="Price: Low to High">Price: Low to High</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {Array.from({ length: 6 }).map((_, idx) => (
              <CardSkeleton key={idx} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-surface-container-low rounded-xl border border-outline-variant/30 px-6">
            <span className="material-symbols-outlined text-[48px] text-outline mb-4">search_off</span>
            <h3 className="font-headline-sm text-primary mb-2">No Products Found</h3>
            <p className="font-body-md text-xs text-on-surface-variant max-w-sm mx-auto mb-6">
              We couldn't find any products matching your search criteria. Try looking at these instead:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => { setSelectedCategory("Playing Cards"); setSearchQuery(""); }}
                className="px-4 py-2 border border-outline rounded-full text-xs font-semibold text-primary hover:bg-surface-container-high cursor-pointer"
              >
                Playing Cards
              </button>
              <button
                onClick={() => { setSelectedCategory("Wedding Stationery"); setSearchQuery(""); }}
                className="px-4 py-2 border border-outline rounded-full text-xs font-semibold text-primary hover:bg-surface-container-high cursor-pointer"
              >
                Wedding Stationery
              </button>
              <button
                onClick={() => { setSelectedCategory(""); setSelectedAesthetics([]); setSearchQuery(""); }}
                className="px-4 py-2 bg-primary text-on-primary rounded-full text-xs font-bold hover:bg-primary-container cursor-pointer border-none"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((product) => {
                const isFav = wishlist.includes(product.id);
                const isLowStock = product.stock > 0 && product.stock <= 15;
                const isOutOfStock = product.stock === 0;

                return (
                  <motion.article
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={product.id}
                    onClick={() => navigateTo("product-detail", product.id)}
                    className="group flex flex-col bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden cursor-pointer border border-outline-variant/10"
                  >
                    {product.isBestseller && (
                      <div className="absolute top-3 left-3 z-10 bg-primary text-on-primary px-3 py-1 rounded-full font-label-md text-xs uppercase tracking-wider">
                        Bestseller
                      </div>
                    )}
                    {product.isNew && (
                      <div className="absolute top-3 left-3 z-10 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md text-xs uppercase tracking-wider">
                        New
                      </div>
                    )}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center pointer-events-none">
                        <span className="bg-surface/90 text-primary font-bold px-4 py-2 rounded-lg text-sm tracking-wider uppercase">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    <div className="relative aspect-[4/5] bg-surface-container overflow-hidden rounded-t-xl">
                      <img
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={product.image}
                      />
                      
                      {/* Quick View Button on Card Hover */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10 pointer-events-none group-hover:pointer-events-auto">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewId(product.id);
                          }}
                          className="bg-surface text-primary px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-on-primary shadow-lg cursor-pointer border-none"
                        >
                          Quick View
                        </motion.button>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        aria-label="Add to Favorites"
                        className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm rounded-full p-2 cursor-pointer text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center border border-outline-variant/10 z-20 border-none"
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: `'FILL' ${isFav ? "1" : "0"}` }}
                        >
                          favorite
                        </span>
                      </button>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <p className="font-label-md text-label-md text-on-surface-variant mb-1">
                        {product.category}
                      </p>
                      <h3 className="font-headline-sm text-sm text-primary mb-2 line-clamp-1 group-hover:text-primary-container transition-colors font-bold">
                        {product.title}
                      </h3>
                      {isLowStock && (
                        <p className="text-[10px] text-error font-bold mb-2">
                          Only {product.stock} left in stock!
                        </p>
                      )}
                       <p className="font-body-md text-body-md text-secondary mt-auto font-bold">
                        {product.currency === "INR"
                          ? `₹ ${(product.price || 0).toLocaleString()}`
                          : `$${(product.price || 0).toFixed(2)}`}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {filtered.length > 0 && !isLoading && (
          <div className="mt-16 flex justify-center">
            <button className="bg-primary text-on-primary font-body-md px-8 py-3 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors duration-300 min-h-[48px] cursor-pointer border-none">
              Discover More
            </button>
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      <QuickViewModal productId={quickViewId} onClose={() => setQuickViewId(null)} />
    </div>
  );
};
export default ShopPage;

