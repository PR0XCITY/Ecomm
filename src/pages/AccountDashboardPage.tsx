import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { AnimatePresence, motion } from "framer-motion";

export const AccountDashboardPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    updateUser,
    wishlist,
    toggleWishlist,
    catalog,
    addToCart,
    orders,
    addToast,
    addLog,
  } = useApp();

  const navigateTo = (page: string, extraId?: string) => {
    if (page === "shop") {
      navigate("/shop" + (extraId ? `?category=${extraId}` : ""));
    } else if (page === "product-detail" && extraId) {
      navigate(`/product/${extraId}`);
    } else {
      navigate(`/${page}`);
    }
  };

  const [activeTab, setActiveTab] = useState<
    "profile" | "addresses" | "cards" | "wishlist" | "orders" | "security"
  >(() => {
    if (location.pathname === "/wishlist") return "wishlist";
    if (location.pathname === "/orders") return "orders";
    return "profile";
  });

  // Selected Order for tracking detail view
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (location.pathname === "/wishlist") {
      setActiveTab("wishlist");
      setSelectedOrderId(null);
    } else if (location.pathname === "/orders") {
      setActiveTab("orders");
      setSelectedOrderId(null);
    } else if (location.pathname === "/account") {
      setActiveTab("profile");
      setSelectedOrderId(null);
    }
  }, [location.pathname]);

  // Address Modal/Form State
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [addressEditId, setAddressEditId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    isDefault: false,
  });

  // Card Modal/Form State
  const [cardFormOpen, setCardFormOpen] = useState(false);
  const [cardForm, setCardForm] = useState({
    cardholder: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Security Edit State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Profile update handler
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      addToast("Name and email are required.", "error");
      return;
    }
    updateUser({
      ...user,
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
    });
    setIsEditingProfile(false);
    addToast("Profile updated successfully!");
    addLog(`Account: Updated profile information`);
  };

  // Address Handlers
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, street, city, state, zip } = addressForm;
    if (!name.trim() || !street.trim() || !city.trim() || !state.trim() || !zip.trim()) {
      addToast("Please fill all address fields.", "error");
      return;
    }

    let updatedAddresses = [...user.addresses];

    if (addressForm.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
    }

    if (addressEditId) {
      // Edit mode
      updatedAddresses = updatedAddresses.map((addr) =>
        addr.id === addressEditId
          ? {
              ...addr,
              ...addressForm,
              id: addressEditId,
            }
          : addr
      );
      addToast("Address updated!");
      addLog(`Account: Edited address "${name}"`);
    } else {
      // Add mode
      const newAddress = {
        ...addressForm,
        id: `addr-${Date.now()}`,
        isDefault: user.addresses.length === 0 ? true : addressForm.isDefault,
      };
      updatedAddresses.push(newAddress);
      addToast("Address added!");
      addLog(`Account: Created address "${name}"`);
    }

    updateUser({ ...user, addresses: updatedAddresses });
    setAddressFormOpen(false);
    setAddressEditId(null);
    resetAddressForm();
  };

  const handleEditAddress = (addrId: string) => {
    const addr = user.addresses.find((a) => a.id === addrId);
    if (addr) {
      setAddressForm({
        name: addr.name,
        street: addr.street,
        city: addr.city,
        state: addr.state,
        zip: addr.zip,
        country: addr.country,
        isDefault: addr.isDefault,
      });
      setAddressEditId(addrId);
      setAddressFormOpen(true);
    }
  };

  const handleDeleteAddress = (addrId: string) => {
    const updated = user.addresses.filter((a) => a.id !== addrId);
    updateUser({ ...user, addresses: updated });
    addToast("Address deleted.", "info");
    addLog(`Account: Deleted address node #${addrId}`);
  };

  const resetAddressForm = () => {
    setAddressForm({
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "India",
      isDefault: false,
    });
  };

  // Card Handlers
  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { cardholder, number, expiry, cvv } = cardForm;
    if (!cardholder.trim() || number.replace(/\s/g, "").length < 15 || expiry.length < 5 || cvv.length < 3) {
      addToast("Please enter valid card information.", "error");
      return;
    }

    const cleanNum = number.replace(/\s/g, "");
    const masked = `•••• •••• •••• ${cleanNum.slice(-4)}`;
    
    // Simple card brand guess
    let brand = "Visa";
    if (cleanNum.startsWith("5")) brand = "Mastercard";
    if (cleanNum.startsWith("3")) brand = "American Express";

    const newCard = {
      id: `card-${Date.now()}`,
      cardholder,
      number: masked,
      expiry,
      cvv: "•••",
      brand,
    };

    updateUser({
      ...user,
      paymentMethods: [...user.paymentMethods, newCard],
    });

    setCardFormOpen(false);
    resetCardForm();
    addToast("Card saved successfully!");
    addLog(`Account: Saved payment card ending in ${cleanNum.slice(-4)}`);
  };

  const handleDeleteCard = (cardId: string) => {
    const updated = user.paymentMethods.filter((c) => c.id !== cardId);
    updateUser({ ...user, paymentMethods: updated });
    addToast("Payment card deleted.", "info");
    addLog(`Account: Removed payment card #${cardId}`);
  };

  const resetCardForm = () => {
    setCardForm({
      cardholder: "",
      number: "",
      expiry: "",
      cvv: "",
    });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").substring(0, 16);
    const formatted = val.replace(/(.{4})/g, "$1 ").trim();
    setCardForm({ ...cardForm, number: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").substring(0, 4);
    let formatted = val;
    if (val.length >= 2) {
      formatted = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
    }
    setCardForm({ ...cardForm, expiry: formatted });
  };

  // Security submit
  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      addToast("All password fields are required.", "error");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addToast("New passwords do not match.", "error");
      return;
    }
    addToast("Password changed successfully!");
    addLog("Account: Security password replaced");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  // Cancel order handler (only valid for Processing/Pending orders)
  const handleCancelOrder = (orderId: string) => {
    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: "Cancelled" as any, // Extend local state representation
        };
      }
      return o;
    });
    // In context, orders handles this ref. We can directly save it to localStorage to bypass backend
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    addToast("Order cancelled successfully.", "info");
    addLog(`Orders: Cancelled order "${orderId}" by customer`);
    // Reload state if needed (or wait for contextual update since we update localStorage, let's trigger reload)
    window.location.reload();
  };

  // Stepper class details
  const getOrderStepperState = (status: string) => {
    switch (status) {
      case "Pending":
        return 1; // Ordered
      case "Processing":
        return 2; // Packaging
      case "Shipped":
        return 3; // Shipped
      case "Out for Delivery":
        return 4; // Out for Delivery
      case "Delivered":
        return 4; // Completed
      default:
        return 0;
    }
  };

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 text-left">
      <header className="mb-12">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary">
          Customer Portal
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2">
          Manage saved credentials, edit address books, and track bespoke orders.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Tab Navigation (Col 3) */}
        <aside className="lg:col-span-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-1">
          <div className="flex items-center gap-3 px-3 py-4 border-b border-outline-variant/30 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-outline bg-surface shrink-0">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-semibold text-on-surface truncate">{user.name}</h3>
              <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
            </div>
          </div>

          {[
            { id: "profile", label: "Personal Info", icon: "person" },
            { id: "orders", label: "Order History", icon: "receipt_long" },
            { id: "wishlist", label: "My Wishlist", icon: "favorite" },
            { id: "addresses", label: "Address Book", icon: "pin_drop" },
            { id: "cards", label: "Payment Methods", icon: "credit_card" },
            { id: "security", label: "Settings & Security", icon: "security" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedOrderId(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 font-label-md text-label-md rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-primary text-on-primary font-bold shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Right Side Content Pane (Col 9) */}
        <main className="lg:col-span-9 bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant/20 shadow-sm min-h-[50vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (selectedOrderId ? `-${selectedOrderId}` : "")}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              {/* TAB 1: PERSONAL INFORMATION */}
              {activeTab === "profile" && (
                <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
                <h2 className="font-headline-sm text-headline-sm text-primary">Personal Profile</h2>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="border border-outline text-on-surface hover:bg-surface-container px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full p-2.5 border border-outline rounded-lg bg-surface-container-lowest text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full p-2.5 border border-outline rounded-lg bg-surface-container-lowest text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Phone Number</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full p-2.5 border border-outline rounded-lg bg-surface-container-lowest text-sm"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="bg-primary text-on-primary px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Save Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileForm({ name: user.name, email: user.email, phone: user.phone });
                        setIsEditingProfile(false);
                      }}
                      className="border border-outline text-on-surface px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 text-sm max-w-md">
                  <div className="grid grid-cols-3 py-2 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant font-medium">Name:</span>
                    <span className="col-span-2 text-on-surface font-semibold">{user.name}</span>
                  </div>
                  <div className="grid grid-cols-3 py-2 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant font-medium">Email:</span>
                    <span className="col-span-2 text-on-surface font-semibold">{user.email}</span>
                  </div>
                  <div className="grid grid-cols-3 py-2 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant font-medium">Phone:</span>
                    <span className="col-span-2 text-on-surface font-semibold">{user.phone || "Not provided"}</span>
                  </div>
                  <div className="grid grid-cols-3 py-2 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant font-medium">Joined:</span>
                    <span className="col-span-2 text-on-surface">{user.memberSince}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADDRESS BOOK */}
          {activeTab === "addresses" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
                <h2 className="font-headline-sm text-headline-sm text-primary">Saved Addresses</h2>
                {!addressFormOpen && (
                  <button
                    onClick={() => {
                      resetAddressForm();
                      setAddressEditId(null);
                      setAddressFormOpen(true);
                    }}
                    className="bg-primary text-on-primary hover:bg-primary-container px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    New Address
                  </button>
                )}
              </div>

              {addressFormOpen ? (
                <form onSubmit={handleAddressSubmit} className="space-y-4 max-w-lg">
                  <h3 className="font-label-md text-primary uppercase tracking-wide">
                    {addressEditId ? "Modify Saved Address" : "New Address Details"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Label / Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Primary Residence, Work"
                        value={addressForm.name}
                        onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                        className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Country</label>
                      <input
                        type="text"
                        required
                        value={addressForm.country}
                        onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                        className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Street Address</label>
                      <input
                        type="text"
                        required
                        placeholder="Flat, building, block, street..."
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-on-surface-variant">City</label>
                      <input
                        type="text"
                        required
                        placeholder="New Delhi"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-on-surface-variant">State / Province</label>
                      <input
                        type="text"
                        required
                        placeholder="Delhi"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-on-surface-variant">ZIP / PIN Code</label>
                      <input
                        type="text"
                        required
                        placeholder="110001"
                        value={addressForm.zip}
                        onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                        className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="addr_def"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                      className="accent-primary w-4 h-4"
                    />
                    <label htmlFor="addr_def" className="text-xs text-on-surface-variant select-none">
                      Mark as default billing &amp; shipping address.
                    </label>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="bg-primary text-on-primary px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAddressFormOpen(false);
                        setAddressEditId(null);
                      }}
                      className="border border-outline text-on-surface px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 border border-outline-variant/30 rounded-xl bg-surface-container-low flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-on-surface flex items-center gap-1.5">
                            {addr.name}
                            {addr.isDefault && (
                              <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px]">
                                Default
                              </span>
                            )}
                          </h4>
                          <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                        </div>
                        <div className="text-xs text-on-surface-variant space-y-1">
                          <p>{addr.street}</p>
                          <p>
                            {addr.city}, {addr.state} - {addr.zip}
                          </p>
                          <p className="font-bold text-on-surface">{addr.country}</p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-outline-variant/20">
                        <button
                          onClick={() => handleEditAddress(addr.id)}
                          className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                        >
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                          Edit
                        </button>
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-xs text-error font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {user.addresses.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-on-surface-variant font-medium">
                      No addresses saved. Please add one to expedite checkout.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PAYMENT METHODS */}
          {activeTab === "cards" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
                <h2 className="font-headline-sm text-headline-sm text-primary">Saved Payment Cards</h2>
                {!cardFormOpen && (
                  <button
                    onClick={() => {
                      resetCardForm();
                      setCardFormOpen(true);
                    }}
                    className="bg-primary text-on-primary hover:bg-primary-container px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    New Card
                  </button>
                )}
              </div>

              {cardFormOpen ? (
                <form onSubmit={handleCardSubmit} className="space-y-4 max-w-lg">
                  <h3 className="font-label-md text-primary uppercase tracking-wide">Enter Card Details</h3>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aanya Sharma"
                      value={cardForm.cardholder}
                      onChange={(e) => setCardForm({ ...cardForm, cardholder: e.target.value })}
                      className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="4111 2222 3333 4444"
                      value={cardForm.number}
                      onChange={handleCardNumberChange}
                      className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-sm font-mono tracking-wider"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Expiry Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardForm.expiry}
                        onChange={handleExpiryChange}
                        className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-sm font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-on-surface-variant">CVV</label>
                      <input
                        type="password"
                        required
                        placeholder="•••"
                        value={cardForm.cvv}
                        onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, "").substring(0, 3) })}
                        className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-sm font-mono text-center"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="bg-primary text-on-primary px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Save Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardFormOpen(false)}
                      className="border border-outline text-on-surface px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.paymentMethods.map((card) => (
                    <div
                      key={card.id}
                      className="relative p-6 rounded-xl text-white overflow-hidden shadow-md bg-gradient-to-br from-primary-container to-primary flex flex-col justify-between aspect-[1.6/1]"
                    >
                      {/* Glossy Overlay effect */}
                      <div className="absolute inset-0 bg-white/5 pointer-events-none" />
                      <div className="flex justify-between items-start z-10">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-primary-fixed-dim">Credit Card</p>
                          <p className="font-display-lg text-sm text-secondary-fixed font-bold mt-0.5">{card.brand}</p>
                        </div>
                        <span className="material-symbols-outlined text-[28px] text-primary-fixed-dim">credit_card</span>
                      </div>
                      <div className="z-10 mt-6">
                        <p className="font-mono text-lg tracking-widest">{card.number}</p>
                      </div>
                      <div className="flex justify-between items-end z-10 mt-4">
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-primary-fixed-dim">Cardholder</p>
                          <p className="text-xs font-semibold uppercase">{card.cardholder}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] uppercase tracking-wider text-primary-fixed-dim">Expires</p>
                          <p className="text-xs font-semibold font-mono">{card.expiry}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors cursor-pointer p-1"
                        title="Delete Card"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  ))}
                  {user.paymentMethods.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-on-surface-variant font-medium">
                      No saved cards. Add card to checkout seamlessly.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="space-y-6">
              <h2 className="font-headline-sm text-headline-sm text-primary border-b border-outline-variant/20 pb-3">
                My Saved Favorites ({wishlist.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((id) => {
                  const prod = catalog.find((p) => p.id === id);
                  if (!prod) return null;
                  return (
                    <div
                      key={id}
                      className="border border-outline-variant/20 rounded-xl bg-surface-container-lowest overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300 relative group"
                    >
                      <button
                        onClick={() => toggleWishlist(id)}
                        className="absolute top-2 right-2 bg-white/80 p-2 rounded-full text-secondary hover:text-on-secondary shadow z-10 cursor-pointer"
                        title="Remove Wishlist"
                      >
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          favorite
                        </span>
                      </button>
                      <div className="aspect-[4/5] bg-surface-container overflow-hidden">
                        <img src={prod.image} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest">{prod.tag}</p>
                          <h4
                            onClick={() => navigateTo("product-detail", prod.id)}
                            className="font-bold text-primary mt-1 hover:underline cursor-pointer line-clamp-1 text-sm"
                          >
                            {prod.title}
                          </h4>
                          <p className="font-bold text-secondary text-sm mt-1">
                            {prod.currency === "INR" ? `₹${prod.price.toLocaleString()}` : `$${prod.price.toFixed(2)}`}
                          </p>
                        </div>
                        <button
                          onClick={() => addToCart(prod, 1, "Default Monogram")}
                          className="w-full bg-primary text-on-primary py-2 rounded-lg text-xs font-semibold mt-4 hover:bg-primary-container transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">shopping_bag</span>
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  );
                })}
                {wishlist.length === 0 && (
                  <div className="col-span-3 text-center py-12 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[48px] text-outline mb-3">favorite_border</span>
                    <p className="font-semibold text-primary">Your wishlist is empty</p>
                    <p className="text-xs text-on-surface-variant mt-1 mb-6">
                      Explore the collections and heart products you love.
                    </p>
                    <button
                      onClick={() => navigateTo("shop")}
                      className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-xs font-bold hover:bg-primary-container transition-colors cursor-pointer"
                    >
                      Shop Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ORDER HISTORY & DETAILS & TRACKER */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              {!selectedOrderId ? (
                <>
                  <h2 className="font-headline-sm text-headline-sm text-primary border-b border-outline-variant/20 pb-3">
                    Your Orders
                  </h2>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-5 border border-outline-variant/30 rounded-xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary text-sm">{order.id}</span>
                            <span className="text-[10px] text-on-surface-variant font-mono">Placed: {order.date}</span>
                          </div>
                          <p className="text-on-surface-variant font-medium">
                            Items: {order.items.map((i) => `${i.quantity}x ${i.title}`).join(", ")}
                          </p>
                          <p className="font-bold text-secondary text-sm">
                            Total: {order.totalFormatted}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold ${
                              order.status === "Shipped"
                                ? "bg-[#e6f4ea] text-[#137333]"
                                : order.status === "Pending"
                                ? "bg-primary-fixed text-on-primary-fixed-variant"
                                : order.status === ("Cancelled" as any)
                                ? "bg-error-container text-on-error-container"
                                : "bg-secondary-container text-on-secondary-container"
                            }`}
                          >
                            {order.status}
                          </span>
                          <button
                            onClick={() => setSelectedOrderId(order.id)}
                            className="bg-primary text-on-primary hover:bg-primary-container px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
                          >
                            Track Order
                          </button>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <div className="text-center py-12 text-on-surface-variant font-medium">
                        No orders recorded. Check out items to see order history.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                (() => {
                  const order = orders.find((o) => o.id === selectedOrderId);
                  if (!order) return null;
                  const stepIndex = getOrderStepperState(order.status);
                  const canCancel = order.status === "Pending" || order.status === "Processing";

                  return (
                    <div className="space-y-6">
                      <button
                        onClick={() => setSelectedOrderId(null)}
                        className="flex items-center gap-1 text-primary hover:underline font-semibold text-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        Back to Orders
                      </button>

                      <div className="flex justify-between items-start border-b border-outline-variant/20 pb-3">
                        <div>
                          <h2 className="font-headline-sm text-headline-sm text-primary">
                            Order {order.id} Details
                          </h2>
                          <p className="text-xs text-on-surface-variant mt-1">Placed on {order.date}</p>
                        </div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold ${
                            order.status === "Shipped"
                              ? "bg-[#e6f4ea] text-[#137333]"
                              : order.status === ("Cancelled" as any)
                              ? "bg-error-container text-on-error-container"
                              : "bg-secondary-container text-on-secondary-container"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* LIVE TRACKING STEPPER */}
                      {order.status !== ("Cancelled" as any) && (
                        <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10 my-6">
                          <h3 className="font-label-md text-primary uppercase tracking-wider mb-8 text-center text-xs">
                            Live Shipping Progress
                          </h3>
                          <div className="flex justify-between items-center max-w-xl mx-auto relative px-4">
                            {[
                              { num: 1, label: "Ordered", icon: "task_alt" },
                              { num: 2, label: "Packaging", icon: "inventory" },
                              { num: 3, label: "Shipped", icon: "local_shipping" },
                              { num: 4, label: "Delivered", icon: "verified" },
                            ].map((step, idx) => (
                              <React.Fragment key={step.num}>
                                <div className="flex flex-col items-center relative z-10">
                                  <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${
                                      stepIndex >= step.num
                                        ? "bg-secondary text-on-secondary shadow-sm"
                                        : "bg-surface text-on-surface-variant border border-outline-variant"
                                    }`}
                                  >
                                    <span className="material-symbols-outlined text-[18px]">
                                      {step.icon}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-[10px] mt-2 font-bold absolute -bottom-5 whitespace-nowrap ${
                                      stepIndex >= step.num ? "text-primary" : "text-on-surface-variant"
                                    }`}
                                  >
                                    {step.label}
                                  </span>
                                </div>
                                {idx < 3 && (
                                  <div
                                    className={`flex-grow h-1 mx-1 rounded transition-colors duration-500 relative z-0 ${
                                      stepIndex > step.num ? "bg-secondary" : "bg-outline-variant/20"
                                    }`}
                                  />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                          <div className="mt-8 text-center">
                            <p className="text-xs text-on-surface-variant">
                              {order.status === "Pending" && "Your order is registered. Curation starting soon."}
                              {order.status === "Processing" && "Our designer team is fanning out your monograms & letterpress."}
                              {order.status === "Shipped" && `Goods are dispatched via ${order.paymentMethod.includes("UPI") ? "Delhivery Express" : "FedEx Priority"}.`}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Items Summary list */}
                      <div className="space-y-3">
                        <h4 className="font-label-md text-on-surface uppercase tracking-wide text-xs">Items Summary</h4>
                        <div className="divide-y divide-outline-variant/20 border border-outline-variant/20 rounded-xl overflow-hidden bg-surface-container-lowest">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4 p-4 items-center">
                              <div className="w-12 h-14 bg-surface-container rounded overflow-hidden shrink-0">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-grow text-xs">
                                <p className="font-bold text-on-surface">{item.title}</p>
                                {item.details && <p className="text-[10px] text-on-surface-variant mt-0.5">Note: "{item.details}"</p>}
                              </div>
                              <div className="text-right text-xs">
                                <p className="font-semibold text-on-surface">{item.quantity} x {order.currency === "INR" ? `₹${item.price.toLocaleString()}` : `$${item.price.toFixed(2)}`}</p>
                                <p className="font-bold text-primary mt-0.5">
                                  {order.currency === "INR" ? `₹${(item.price * item.quantity).toLocaleString()}` : `$${(item.price * item.quantity).toFixed(2)}`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-4 border-t border-outline-variant/20">
                        <div className="text-on-surface-variant">
                          <p>Payment: <strong className="text-on-surface font-semibold">{order.paymentMethod}</strong></p>
                          <p className="mt-0.5">Total Amount: <strong className="text-secondary font-bold">{order.totalFormatted}</strong></p>
                        </div>
                        {canCancel && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="bg-error-container hover:bg-error/10 text-error px-4 py-2 rounded-lg font-bold cursor-pointer transition-colors"
                          >
                            Cancel Shipment
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* TAB 6: SETTINGS & SECURITY */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="font-headline-sm text-headline-sm text-primary border-b border-outline-variant/20 pb-3">
                Security &amp; Settings
              </h2>

              <form onSubmit={handleSecuritySubmit} className="space-y-4 max-w-lg">
                <h3 className="font-label-md text-on-surface uppercase tracking-wide">Replace Password</h3>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Current Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-on-surface-variant">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-sm font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-primary-container transition-colors cursor-pointer"
                >
                  Change Password
                </button>
              </form>

              {/* Notification Preferences */}
              <div className="pt-6 border-t border-outline-variant/20 space-y-4">
                <h3 className="font-label-md text-on-surface uppercase tracking-wide">Notification Settings</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-primary w-4 h-4" />
                    <span className="text-xs text-on-surface-variant">Email me shipping tracking statuses &amp; courier milestones.</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-primary w-4 h-4" />
                    <span className="text-xs text-on-surface-variant">Notify me about newly approved catalog stationery.</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="accent-primary w-4 h-4" />
                    <span className="text-xs text-on-surface-variant">Send me SMS texts for instant delivery updates.</span>
                  </label>
                </div>
              </div>
            </div>
          )}
          </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AccountDashboardPage;
