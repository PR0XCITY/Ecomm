import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import { mockTestimonials } from "../mock/mockData";
import { QuickViewModal } from "../components/QuickViewModal";

export const Homepage: React.FC = () => {
  const { navigateTo, banners, recentlyViewed, catalog, toggleWishlist, wishlist } = useApp();
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  
  // Newsletter Form State
  const [email, setEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleProductClick = (id: string) => {
    navigateTo("product-detail", id);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setNewsletterSubscribed(true);
    setEmail("");
  };

  // Curate featured and viewed items
  const featuredIds = ["wedding-invitation-suite", "custom-gold-foil-cards", "personalized-henna-badges"];
  const featuredProducts = catalog.filter((p) => p && featuredIds.includes(p.id));
  const viewedProducts = catalog.filter((p) => p && recentlyViewed.includes(p.id));

  // Motion variants
  const fadeInUp: any = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex-grow bg-surface animate-page-fade-in">
      {/* Announcement Banner */}
      {banners && (
        <div className="bg-primary text-on-primary text-center py-2.5 px-4 text-[11px] md:text-xs font-semibold uppercase tracking-wider relative overflow-hidden">
          <div className="animate-pulse absolute inset-0 bg-white/5 pointer-events-none" />
          <span className="relative z-10">{banners}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative w-full h-[75vh] md:h-[85vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-[#240309]">
        {/* Parallax Image Overlay */}
        <div className="absolute inset-0 z-0 animate-hero-image">
          <img
            alt="Elegant Wedding Stationery Hero"
            className="w-full h-full object-cover object-center"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFkCBKghdr-EtT29gkp7qdNHHB63sM-uBw3PZTpg3aFEXckZV0mZ7Znu_HTVn29S30skNQcDPhgxDLg8yYQlZLtl6rylngTnInIl68cwTRE6y6i2j4PY_ba_xXXF8vIz8Z3Zg4U_UjJWhHQm--jWmRly-h2tS2ZfvsVe5QRRaJ6O-gPMwT9_E602Fu1QBp7fm7sgYNVBFOlMZ_ZofnZ7c-ReyA0R70R5orPwJ0R9yi8IxSBWHtbjsKYhWM0Xep4wGkk7jzIkaD"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-3xl px-margin-mobile flex flex-col items-center gap-8">
          <div className="bg-surface/85 backdrop-blur-md p-8 md:p-12 rounded-[24px] border border-white/20 shadow-xl animate-hero-fade-in">
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tight mb-4 text-balance">
              Memories, Printed.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-xl mx-auto text-balance">
              Bespoke celebratory goods crafted with sophisticated joy. Experience the tactile elegance of modern heritage.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateTo("shop")}
              className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 bg-primary text-on-primary rounded-full font-label-md text-label-md uppercase tracking-wider hover:bg-primary-container hover:text-on-primary-container shadow-md transition-all duration-300 cursor-pointer border-none"
            >
              Explore Products
            </motion.button>
          </div>
        </div>
      </section>


      {/* Trust Ribbon Section */}
      <section className="bg-surface border-y border-outline-variant/20 py-8 px-4">
        <div className="max-w-container-max mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: "star_rate", title: "24k Gold Foil Stamp", desc: "Intricate hot-stamped edges" },
            { icon: "layers", title: "600gsm Cotton Stock", desc: "Tactile, premium card weight" },
            { icon: "brush", title: "Bespoke Curation", desc: "Tailored to your monograms" },
            { icon: "security", title: "Secure Transactions", desc: "Fully protected payments" }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-1.5 p-2">
              <span className="material-symbols-outlined text-secondary text-[28px]">{item.icon}</span>
              <h4 className="font-semibold text-primary text-xs uppercase tracking-wider">{item.title}</h4>
              <p className="text-[10px] text-on-surface-variant">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 md:py-28 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="space-y-6"
          >
            <span className="text-secondary font-bold text-xs uppercase tracking-widest">Our Heritage</span>
            <h2 className="font-display-lg text-primary text-3xl md:text-4xl leading-tight">
              A Legacy of Letterpress and Luxury Cards
            </h2>
            <p className="font-body-lg text-sm text-on-surface-variant leading-relaxed">
              At Shuffling Smiles, we believe that celebrations are milestones in time that deserve to be tangible. We merge historic Indian motifs and symmetrical designs with modern western minimalism to print keepsakes that reside in drawers for lifetimes.
            </p>
            <p className="font-body-lg text-sm text-on-surface-variant leading-relaxed">
              Every gold border is hand-aligned, every tuck box is individual-stamped, and every client receives custom digital previews before a single drop of ink lands on paper.
            </p>
            <motion.button
              whileHover={{ x: 5 }}
              onClick={() => navigateTo("shop", "Playing Cards")}
              className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-1 cursor-pointer border-none bg-transparent hover:underline"
            >
              Browse Playing Cards
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </motion.button>
          </motion.div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container shadow-lg group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm2ft6JhqPGH94byzSmBwoBrEncSQajELtSNlBXClBzAeX1b76e12e3DOhs-B6L8zGa9WFVew5OwNhuSRKrHjE_G1hCYYxgPPHuLJyYgbaEdjimOxlBmY1IWFicHYhvDbMQ2qRn2xcJZNRqEjK-NJApds5settB-fxVa8DHhI1qrdCD_1gmncv6uDLIcSi9FNUM5X95anHV0DwA_jcuUu1kR-1i8s722FYcC3aAzMfdwV_X6EZKgWxtJZXi-B4ekVDHf41iU6l"
              alt="Brand Story details"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
          </div>
        </div>
      </section>

      {/* Featured Curation Grid */}
      <section className="py-24 bg-surface-container-low px-margin-mobile md:px-margin-desktop text-left">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-2 block">
              Curated Collections
            </span>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">Milestone Favorites</h2>
            <div className="w-16 h-0.5 bg-secondary mx-auto opacity-50"></div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop"
          >
            {featuredProducts.map((product) => {
              const isFav = wishlist.includes(product.id);
              return (
                <motion.div
                  key={product.id}
                  variants={fadeInUp}
                  className="group bg-surface rounded-[16px] shadow-[0_4px_24px_rgba(78,8,22,0.04)] hover:shadow-[0_8px_32px_rgba(78,8,22,0.08)] transition-all duration-500 overflow-hidden flex flex-col relative border border-outline-variant/30 text-left"
                >
                  <div 
                    onClick={() => handleProductClick(product.id)}
                    className="relative w-full aspect-[4/5] overflow-hidden bg-surface-container-low cursor-pointer"
                  >
                    <img
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      src={product.image}
                    />
                    
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm p-2 rounded-full text-on-surface-variant hover:text-primary z-20 transition-all border-none flex items-center justify-center shadow"
                    >
                      <span 
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: `'FILL' ${isFav ? "1" : "0"}` }}
                      >
                        favorite
                      </span>
                    </button>

                    {/* Quick View Overlay on Desktop */}
                    <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10 pointer-events-none group-hover:pointer-events-auto">
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

                    <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full font-label-md text-[11px] text-primary font-bold border border-primary/10">
                      {product.tag}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow justify-between bg-surface z-10 relative">
                    <div onClick={() => handleProductClick(product.id)} className="cursor-pointer">
                      <h3 className="font-headline-sm text-[20px] text-primary mb-2 group-hover:text-primary-container transition-colors truncate">
                        {product.title}
                      </h3>
                      <p className="font-body-md text-sm text-on-surface-variant line-clamp-2">{product.description}</p>
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                      <span className="font-body-lg text-secondary font-semibold">
                        {product.currency === "INR" ? `₹${(product.price || 0).toLocaleString()}` : `$${(product.price || 0).toFixed(2)}`}
                      </span>
                      <button
                        onClick={() => handleProductClick(product.id)}
                        className="text-primary hover:translate-x-1 transition-transform duration-300 cursor-pointer border-none bg-transparent flex items-center"
                      >
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="mt-16 text-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateTo("shop")}
              className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 bg-transparent border-2 border-secondary text-secondary rounded-full font-label-md text-label-md uppercase tracking-wider hover:bg-secondary hover:text-on-primary transition-colors duration-300 cursor-pointer"
            >
              View Full Catalogue
            </motion.button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-surface-container-low py-24 md:py-32 relative overflow-hidden text-left border-t border-outline-variant/10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-fixed-dim/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3 text-center md:text-left">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-2 block">
                Client Stories
              </span>
              <h2 className="font-headline-md text-headline-md text-primary mb-6">
                Crafted with Sophisticated Joy
              </h2>
              <p className="font-body-md text-on-surface-variant">
                Hear from the couples who chose to make their milestones tangible, tactile, and unforgettable.
              </p>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockTestimonials.map((testimonial, idx) => (
                <div
                  key={testimonial.id}
                  className={`bg-surface rounded-2xl p-8 shadow-sm border border-white hover:shadow-md transition-shadow duration-300 ${
                    idx === 1 ? "md:translate-y-8" : ""
                  }`}
                >
                  <div className="flex gap-1 text-secondary mb-4">
                    {Array.from({ length: testimonial.stars }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                    ))}
                  </div>
                  <p className="font-headline-sm text-sm text-primary italic mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="font-label-md text-on-surface-variant uppercase tracking-wider text-[11px] font-bold">
                    — {testimonial.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Experience */}
      <section className="bg-[#4e0816] py-20 px-margin-mobile text-white text-center relative overflow-hidden">
        {/* Subtle Background Art */}
        <div className="absolute inset-0 opacity-10 flex justify-center items-center pointer-events-none">
          <span className="material-symbols-outlined text-[240px]">mail</span>
        </div>

        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          <span className="text-secondary-fixed text-xs font-bold uppercase tracking-widest">Newsletter</span>
          <h2 className="font-display-lg text-3xl md:text-4xl text-white">Join Shuffling Smiles</h2>
          <p className="font-body-md text-xs text-white/80 max-w-sm mx-auto leading-relaxed">
            Subscribe to receive priority notifications on new bespoke playing card editions and seasonal letterpress catalogs.
          </p>

          <AnimatePresence mode="wait">
            {newsletterSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white/10 p-5 rounded-xl border border-white/20 max-w-md mx-auto"
              >
                <p className="font-semibold text-secondary-fixed text-sm flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">verified</span>
                  Subscription Confirmed!
                </p>
                <p className="text-[11px] text-white/80 mt-1">Thank you for joining our modern heritage circle.</p>
              </motion.div>
            ) : (
              <motion.form 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <div className="flex-grow">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-xs placeholder-white/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                  />
                  {emailError && <p className="text-left text-xs text-error-container mt-1">{emailError}</p>}
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="bg-white text-primary px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white-container transition-colors cursor-pointer border-none shrink-0"
                >
                  Subscribe
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Recently Viewed Panel */}
      {viewedProducts.length > 0 && (
        <section className="py-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto border-t border-outline-variant/20 text-left">
          <h2 className="font-headline-md text-headline-sm text-primary mb-10">Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {viewedProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="group flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-[4/5] bg-surface-container overflow-hidden relative">
                  <img
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    src={product.image}
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-body-md font-semibold text-primary line-clamp-1">{product.title}</h3>
                  <p className="text-xs text-on-surface-variant mt-1">{product.category}</p>
                  <span className="text-sm font-semibold text-secondary mt-3">
                    {product.currency === "INR" ? `₹ ${(product.price || 0).toLocaleString()}` : `$${(product.price || 0).toFixed(2)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reusable Quick View Overlay */}
      <QuickViewModal productId={quickViewId} onClose={() => setQuickViewId(null)} />
    </div>
  );
};
export default Homepage;

