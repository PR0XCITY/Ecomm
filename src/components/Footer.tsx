import React from "react";
import { useApp } from "../context/AppContext";

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  const handleLinkClick = (e: React.MouseEvent, page: "home" | "shop" | "cart") => {
    e.preventDefault();
    navigateTo(page);
  };

  return (
    <footer className="bg-surface-container-highest w-full mt-auto border-t border-outline-variant/20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter-desktop px-margin-mobile md:px-margin-desktop py-margin-desktop max-w-container-max mx-auto">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
          <span
            onClick={() => navigateTo("home")}
            className="font-headline-sm text-headline-sm text-primary cursor-pointer hover:opacity-80 transition-opacity w-fit"
          >
            Shuffling Smiles
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
            Elevating life's celebrations through beautifully crafted, personalized stationery and goods. Blending modern minimalism with rich heritage.
          </p>
        </div>

        {/* Links Column 1 */}
        <div className="col-span-1 flex flex-col gap-3 font-body-md text-body-md">
          <a
            onClick={(e) => handleLinkClick(e, "home")}
            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            href="#"
          >
            Home Page
          </a>
          <a
            onClick={(e) => handleLinkClick(e, "shop")}
            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            href="#"
          >
            Shop Collections
          </a>
          <a
            onClick={(e) => handleLinkClick(e, "cart")}
            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            href="#"
          >
            Your Shopping Bag
          </a>
        </div>

        {/* Links Column 2 */}
        <div className="col-span-1 flex flex-col gap-3 font-body-md text-body-md">
          <a
            onClick={(e) => e.preventDefault()}
            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            onClick={(e) => e.preventDefault()}
            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            href="#"
          >
            Terms of Service
          </a>
          <a
            onClick={(e) => e.preventDefault()}
            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            href="#"
          >
            Shipping &amp; Returns
          </a>
          <a
            onClick={(e) => e.preventDefault()}
            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            href="#"
          >
            Contact Us
          </a>
        </div>

        {/* Copyright Line */}
        <div className="col-span-1 md:col-span-4 mt-12 pt-8 border-t border-outline-variant/20">
          <p className="font-body-md text-body-md text-on-surface-variant text-center md:text-left">
            © 2024 Shuffling Smiles. Crafted with Sophisticated Joy.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
