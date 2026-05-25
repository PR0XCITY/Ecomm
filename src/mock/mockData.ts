export interface Product {
  id: string;
  title: string;
  category: "Playing Cards" | "Wedding Stationery" | "Badges" | "Tic-Tac-Toe sheets" | "Favors" | "Accessories";
  price: number;
  currency: "INR" | "USD";
  priceUSD?: number;
  priceFormatted: string;
  image: string;
  tag: string;
  description: string;
  detailedDescription?: string;
  aesthetics: ("Floral" | "Geometric" | "Minimal" | "Regal")[];
  isBestseller?: boolean;
  isNew?: boolean;
  stock: number;
  rating: number;
  reviewsCount: number;
  status?: "Draft" | "Published" | "Scheduled" | "Archived";
  scheduledDate?: string;
  variants?: { name: string; options: string[] }[];
  seo?: { title: string; description: string };
  specifications?: { name: string; value: string }[];
  tags?: string[];
}

export interface Testimonial {
  id: string;
  stars: number;
  quote: string;
  author: string;
}

export interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  details: string;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  currency: "INR" | "USD";
  totalFormatted: string;
  status: "Processing" | "Pending" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";
  date: string;
  paymentMethod: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
}

export interface Coupon {
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrderValue: number;
  active: boolean;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: "order" | "system" | "promo";
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
}

export const mockProducts: Product[] = [
  {
    id: "wedding-invitation-suite",
    title: "Wedding Invitation Suite",
    category: "Wedding Stationery",
    price: 42500,
    currency: "INR",
    priceUSD: 450,
    priceFormatted: "From $450",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBx4_9aBVTmSw53V26dxzt4BnvNDcpMoH235RrDgOTlZYYkWITHFmjtB7xLO7rqRx3c29CTZFM3E2q98OEpHC0KtrFlOgo3FP5CGxoaYIA34WLRWNnYaRA4xa2osgbcsdY9-LEEdkekNokNQjNoVt4aQ0cXbQ1vUN73wfN34rTiMLA_t1EDfzNakv2liVwXjQohaPwhLZx2lgpVKpVH9yaYbkPCVXvKm5OaZTECZNgsmjN_U9MKyu_t9V87fVRyC2xQtd1DDRV-",
    tag: "Wedding",
    description: "Exquisite, hand-crafted invitations tailored to your unique love story.",
    detailedDescription: "Set the perfect tone for your special day with our bespoke floral invitations. Crafted on premium, heavyweight cotton cardstock that feels luxurious to the touch, each piece is a testament to sophisticated joy. The design blends traditional watercolor botanicals with clean, modern typography, ensuring your love story is presented with timeless elegance.",
    aesthetics: ["Floral", "Minimal"],
    isNew: false,
    stock: 120,
    rating: 4.9,
    reviewsCount: 15,
    status: "Published",
    variants: [
      { name: "Size", options: ["A5 Suite", "A6 Suite"] },
      { name: "Paper Weight", options: ["300gsm Cotton", "600gsm Cotton", "800gsm Letterpress"] },
      { name: "Envelope Style", options: ["Gold Foil Liner", "Wax Sealed Classic", "Minimal Crest"] }
    ],
    specifications: [
      { name: "Material", value: "100% Cotton Fiber Cardstock" },
      { name: "Printing Method", value: "Flat Matte Ink & Gold Foil Stamping" },
      { name: "Envelope Weight", value: "180gsm textured stock" },
      { name: "Origin", value: "Handcrafted in New Delhi, India" }
    ],
    seo: { title: "Hand-Crafted Wedding Invitation Suite | Shuffling Smiles", description: "Bespoke watercolor floral wedding invitation sets stamped with 24k gold foil." }
  },
  {
    id: "custom-gold-foil-cards",
    title: "Custom Gold-Foil Playing Cards",
    category: "Playing Cards",
    price: 15000,
    currency: "INR",
    priceUSD: 25,
    priceFormatted: "$25 / deck",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCm2ft6JhqPGH94byzSmBwoBrEncSQajELtSNlBXClBzAeX1b76e12e3DOhs-B6L8zGa9WFVew5OwNhuSRKrHjE_G1hCYYxgPPHuLJyYgbaEdjimOxlBmY1IWFicHYhvDbMQ2qRn2xcJZNRqEjK-NJApds5settB-fxVa8DHhI1qrdCD_1gmncv6uDLIcSi9FNUM5X95anHV0DwA_jcuUu1kR-1i8s722FYcC3aAzMfdwV_X6EZKgWxtJZXi-B4ekVDHf41iU6l",
    tag: "Favors",
    description: "A luxurious and memorable favor for your discerning guests.",
    detailedDescription: "Bespoke monogrammed playing cards featuring intricate, symmetrical gold foil backing. Perfect keepsake items to commemorate your grand celebration.",
    aesthetics: ["Geometric", "Regal"],
    isBestseller: true,
    stock: 15,
    rating: 4.8,
    reviewsCount: 22,
    status: "Published",
    variants: [
      { name: "Foil Color", options: ["Gold Foil", "Silver Foil", "Rose Gold"] },
      { name: "Card Finish", options: ["Premium Linen", "Classic Smooth"] }
    ],
    specifications: [
      { name: "Stock", value: "310gsm German Black Core cardstock" },
      { name: "Coating", value: "Tactile Air-cushion Finish" },
      { name: "Tuck Box", value: "Premium debossed matte cardstock with gold foil interiors" }
    ],
    seo: { title: "Custom Gold Foil Monogrammed Playing Cards | Shuffling Smiles", description: "Keepsake luxury playing cards featuring symmetrical hot stamp gold foil linings." }
  },
  {
    id: "personalized-henna-badges",
    title: "Personalized Henna-Design Badges",
    category: "Badges",
    price: 800,
    currency: "INR",
    priceUSD: 8,
    priceFormatted: "$8 / each",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuChrvCd3NVnawkxmS-buKLboBGQxc6jxZgFiWjpAIoeWenIyFfTQwJlRpoRt0Ts1bLp3Wc5LlVIsNG1IoI-9tDDW_md4Rxc9W1dnvOc5geiElB7AeJbgZqpe292UvicPs8f361Bon0j3ZcA8UlbSyhq7de_3knGP4wlkPMdDLbX-yB5iXZeBH0n4vUuQWflvUugSZKYbi3SzyeBxQhDT49hh8Ndf0ir4ZBn1NuY1k8Ym54OtdFFuuMfxv8h2zqbeSHTFAbDSDKO",
    tag: "Accessories",
    description: "Playful yet elegant accessories to unite your wedding party.",
    detailedDescription: "Unify your wedding party with high-quality badges displaying customized text and delicate, contemporary henna illustrations.",
    aesthetics: ["Minimal", "Floral"],
    isNew: false,
    stock: 85,
    rating: 4.7,
    reviewsCount: 8,
    status: "Published",
    variants: [
      { name: "Attachment", options: ["Safety Pin", "Magnetic Clasp"] },
      { name: "Background Color", options: ["Burgundy", "Navy", "Blush Pink"] }
    ],
    specifications: [
      { name: "Material", value: "Polished brass bezel with acrylic dome" },
      { name: "Diameter", value: "58 mm" },
      { name: "Waterproof", value: "Yes (splash resistant)" }
    ],
    seo: { title: "Personalized Henna Wedding Party Badges | Shuffling Smiles", description: "Bespoke brass accessories and pins detailing custom names and contemporary mehndi patterns." }
  },
  {
    id: "marigold-heirloom-deck",
    title: "The Marigold Heirloom Deck",
    category: "Playing Cards",
    price: 1499,
    currency: "INR",
    priceUSD: 20,
    priceFormatted: "₹ 1,499",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8Box3bGvcS0lUJTq3tnBNZj7tpvybzS6vJDAcodgNFu8pgS7PXudgN-rZ8qA7sDOOjeTsQvdkXzr5UeZXBiHbDhGr-yvwdXBb5bvZMP_fq6IjyXh5GsSfORomY-QhHO9U4jkK0BeXxHV0qXkroVOjDAGrffVqQvG3EMVtHFUYlxiA30VPyMfndF0Zr2saYJNcykwf82RouijHC3zvOF8pCLfSPm0dKoNme2H8TJGwrQPS95ICQsW3dhfmxmig4Dpi-hoRpVjD",
    tag: "Playing Cards",
    description: "Premium playing cards with intricate marigold gold foil detailing.",
    detailedDescription: "A gorgeous deck displaying deep burgundy accents and gold foil patterns. Inspired by traditional Indian block prints.",
    aesthetics: ["Floral", "Regal"],
    stock: 45,
    rating: 5.0,
    reviewsCount: 14,
    status: "Published",
    variants: [
      { name: "Foil Color", options: ["Marigold Gold", "Rose Quartz"] }
    ],
    specifications: [
      { name: "Stock", value: "300gsm French core linen" },
      { name: "Coating", value: "Airless finish coating" }
    ],
    seo: { title: "Marigold Heirloom Gold-Foil Playing Cards | Shuffling Smiles", description: "Marigold-themed custom card deck with burgundy block print outlines." }
  },
  {
    id: "crimson-peacock-edition",
    title: "Crimson Peacock Edition",
    category: "Playing Cards",
    price: 1899,
    currency: "INR",
    priceUSD: 24,
    priceFormatted: "₹ 1,899",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiMkns1SCGi255V5nw6mKwTdkb9o3S4UVkBZ3yoG-4B_xbyM8gjibnDjwdItVE0GY9nZyRbZrJeF2sS2lc5jE9bgWDhKeSB282w5nbI_Rl7UiMlPW-4EF62ZzwHnZwKIhkLnoYme8B4m19KOW-a75R71vxmaj1jhmSDnU6WCpr2GY6iN1w00J7OT6mJXO17JLyahZdbeyTGjeLlwWuDH4XMoIqghgkCH3-uWqhwJJzuBwu47uNTtlaHG-DHWlreRWpEkmMccqJ",
    tag: "Playing Cards",
    description: "Luxurious playing cards in deep crimson with metallic peacock motifs.",
    detailedDescription: "Raised gold metallic typography and peacock designs on premium cardstock. Packaged inside a debossed crimson tuck box.",
    aesthetics: ["Geometric", "Regal"],
    stock: 8,
    rating: 4.9,
    reviewsCount: 30,
    status: "Published",
    variants: [
      { name: "Tuck Style", options: ["Debossed Tuck Box", "Signature Acrylic Case"] }
    ],
    specifications: [
      { name: "Foil Type", value: "Raised metallic foil printing" },
      { name: "Stock", value: "330gsm premium black core" }
    ],
    seo: { title: "Crimson Peacock Premium Playing Cards | Shuffling Smiles", description: "Raised gold metallic deck inspired by royal peacock motifs." }
  },
  {
    id: "lotus-vine-poker-set",
    title: "Lotus & Vine Poker Set",
    category: "Playing Cards",
    price: 1299,
    currency: "INR",
    priceUSD: 18,
    priceFormatted: "₹ 1,299",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFkCBKghdr-EtT29gkp7qdNHHB63sM-uBw3PZTpg3aFEXckZV0mZ7Znu_HTVn29S30skNQcDPhgxDLg8yYQlZLtl6rylngTnInIl68cwTRE6y6i2j4PY_ba_xXXF8vIz8Z3Zg4U_UjJWhHQm--jWmRly-h2tS2ZfvsVe5QRRaJ6O-gPMwT9_E602Fu1QBp7fm7sgYNVBFOlMZ_ZofnZ7c-ReyA0R70R5orPwJ0R9yi8IxSBWHtbjsKYhWM0Xep4wGkk7jzIkaD",
    tag: "Playing Cards",
    description: "Playfully fanned cards displaying watercolor floral motifs.",
    detailedDescription: "Hand-painted lotuses and trailing vines on custom card faces. Coated with a premium linen finish.",
    aesthetics: ["Floral", "Minimal"],
    isBestseller: true,
    stock: 200,
    rating: 4.6,
    reviewsCount: 19,
    status: "Published",
    variants: [
      { name: "Pack Size", options: ["Single Deck", "Double Set in Wooden Box"] }
    ],
    specifications: [
      { name: "Stock", value: "310gsm casino grade" },
      { name: "Finish", value: "Linen weave" }
    ],
    seo: { title: "Lotus and Vine Luxury Poker Playing Cards | Shuffling Smiles", description: "A casino-grade custom linen deck containing hand-painted watercolor lotuses." }
  },
  {
    id: "gold-foil-travel-grid",
    title: "Gold Foil Travel Grid",
    category: "Tic-Tac-Toe sheets",
    price: 899,
    currency: "INR",
    priceUSD: 12,
    priceFormatted: "₹ 899",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAF7AHQvYZASFL3cWOPJDCZqQ7cKvfPTWJnLmjabepLtEhfm3gP9-ubSSXnsm8KcnXmjXLAHFCXHXqO99zyYRxOMc8Hrl6q2KzOO1kQnfJKe0m8NsQzR4Lo7T86WgEh8QqAFGJp39MDjCjeF6bGSki2BHi7UJLKFeXqVSofbKMq3ykayLa79P-k4aDtevi6dyZqitQjWQ9_MpwyKX5uyVvov7UShV6m86dojFi8YO_xBZC0_GxCjM4A18mi84-bmuyXrVDmCOGx",
    tag: "Tic-Tac-Toe",
    description: "Premium cream cardstock travel game set with gold foil grid lines.",
    detailedDescription: "Beautifully bound sheets featuring gold foil gaming grids. Includes 10 acrylic tokens in deep burgundy and gold.",
    aesthetics: ["Geometric", "Minimal"],
    stock: 60,
    rating: 4.4,
    reviewsCount: 3,
    status: "Published",
    variants: [
      { name: "Sheet Count", options: ["20 Sheets", "50 Sheets"] }
    ],
    specifications: [
      { name: "Paper", value: "250gsm high-density cardstock" },
      { name: "Tokens", value: "10 acrylic laser-cut tokens" }
    ],
    seo: { title: "Gold Foil Stamp Travel Tic-Tac-Toe Cards | Shuffling Smiles", description: "Keepsake high-density cardstock gaming sheets detailed in gold grid alignments." }
  },
  {
    id: "royal-jaipur-suite",
    title: "The Royal Jaipur Suite",
    category: "Wedding Stationery",
    price: 4500,
    currency: "INR",
    priceUSD: 60,
    priceFormatted: "From ₹ 4,500",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOmhvmGV_UWWxZ6sg7X0Z_fGc2Gm-8N50EBioxXc9yEt2IwIkMUVWSZBpGieFsqEj55XWquDNkQeyh8qJIp0e6a6V11pDuK85FzeGHEau0fLa3srNhUaAmWBCJfTEN3aBK7pJPURACwcHUbT7RFJpiNTpYz399JSVjEI9PX6IWUishjdvhM6NSmenWfhkgs-N99in9U40KZdel4m0S1vFDoSGqn6-EwVXStkG8dyqW2gnVG7BtVcnM-c7W-RJt6PlU5j2xHbaQ",
    tag: "Wedding Stationery",
    description: "Serene, upscale wedding stationery reflecting pink city heritage.",
    detailedDescription: "Gold borders, soft blush cardstock, and detailed borders inspired by Jaipur architecture.",
    aesthetics: ["Regal", "Minimal"],
    stock: 50,
    rating: 4.9,
    reviewsCount: 11,
    status: "Published",
    variants: [
      { name: "Size", options: ["A5 Suite", "A6 Deckle-Edge"] },
      { name: "Paper", options: ["Handmade Rag Paper", "Textured Cotton Paper"] }
    ],
    specifications: [
      { name: "Borders", value: "Jaipur arch architectural borders" },
      { name: "Foil", value: "24k gold stamp accents" }
    ],
    seo: { title: "Royal Jaipur Wedding Invites | Shuffling Smiles", description: "Upscale blush pink watercolor wedding invitation cards inspired by Jaipur arches." }
  },
  {
    id: "heritage-enamel-pin-set",
    title: "Heritage Enamel Pin Set",
    category: "Badges",
    price: 1100,
    currency: "INR",
    priceUSD: 15,
    priceFormatted: "₹ 1,100",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBPRKadwt4GHqK3Q21Z9oRpaNHbef5YA2alVRdgdix2IyhpXylpxRdLXeoy6XFTDbi_XBLthVL-X9hzuNYGCjWZW9rQSl61R3IVIBM6nZOaEx32QJ0F_aGAg3tIbGQt30NsH3JsrpiUBspiuuNWlWfCZ_z-iFp-WMtTpbmxxvnR1yZkkDIx_spMkK_JokWduOVJDrjWhXv-JOut_PW7EGO_83ToE3LpqiCpYLaYPMbTuin3OMSg7ASLBVlylLBil8-ke-o-Mkm",
    tag: "Badges",
    description: "Artsy enamel pins capturing elephants, lotuses, and mandalas.",
    detailedDescription: "A set of three polished enamel badges pinned to burgundy backing. Perfect groomsmen or bridesmaid gifts.",
    aesthetics: ["Floral", "Regal"],
    isNew: true,
    stock: 35,
    rating: 4.8,
    reviewsCount: 7,
    status: "Published",
    variants: [
      { name: "Metal Finish", options: ["Antique Brass", "Polished Gold"] }
    ],
    specifications: [
      { name: "Pin Type", value: "Hard enamel pins" },
      { name: "Attachment", value: "Double rubber backing posts" }
    ],
    seo: { title: "Heritage Hard Enamel Wedding Keepsake Pins | Shuffling Smiles", description: "elephant and lotus Hard enamel pins mounted on debossed burgundy presentation cards." }
  }
];

export const mockTestimonials: Testimonial[] = [
  {
    id: "t1",
    stars: 5,
    quote: "The quality of the cardstock and the precision of the gold foil completely blew us away. It set the perfect tone for our entire celebration.",
    author: "Priya & Arjun"
  },
  {
    id: "t2",
    stars: 5,
    quote: "Working with the Shuffling Smiles team was a dream. They understood our vision of 'modern heritage' perfectly and delivered beyond expectations.",
    author: "Sarah & Michael"
  }
];

export const mockInitialOrders: Order[] = [
  {
    id: "#SS-101",
    customerName: "Aanya Sharma",
    items: [
      {
        id: "wedding-invitation-suite",
        title: "Custom Floral Wedding Invite Set",
        quantity: 100,
        details: "Aarav & Priya",
        price: 42500,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5DOtowaeMUP6KYrtqOC1dvE_q2LMPYQR1QUnzyueahZlsfMa9ONpBo2i7AqqpDwOjNiMCQb3cxg-d4CQutdYKWCoRaLS8Q60gQW4hAvS_S224RdzouPDAsI2BF39cawbQhImlpWw16EnYX-LXo4xhc_NnKBWo8WrWbihhs-PhkKKgf43z3kxUlx7FvXN7Imo1E8f3lbeatkPXDpsumOBjL78nfe8CeDuquJfagHlMHCfOGV7IxK0plo9hlXrce81iKnCB85nM"
      }
    ],
    total: 57500,
    currency: "INR",
    totalFormatted: "₹57,500",
    status: "Processing",
    date: "Oct 24, 2024",
    paymentMethod: "Visa ending 4242"
  },
  {
    id: "#SS-102",
    customerName: "Rohan Patel",
    items: [
      {
        id: "custom-gold-foil-cards",
        title: "Bespoke Monogram Playing Cards",
        quantity: 50,
        details: "A&P",
        price: 15000,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXDQq83ldQVf21CiKW_XCUzDvpqqDbCOHbk978jlhD_MvM2A0zGmQJBNNo_m2a5mKeVJ8zM3CkY1vLh3ZcJtwDj5c97Xyl9h8TfuO3UBVQ4xaX6WWa7dmo9Kwm16E3MtRanDNFnHsXr8qKFCvdxGG-o0iBWGnVtox8A-Rk0EBoC3Lv0HauJ9PV1hfITQbjRTxG0eKfWPyD_Pb9vt2hO9SWT0gVtEC0SydM3iYeII5bOPYQhJAQ5UxseNlemsP0Sljk1Rtz4smA"
      }
    ],
    total: 12000,
    currency: "INR",
    totalFormatted: "₹12,000",
    status: "Pending",
    date: "Oct 23, 2024",
    paymentMethod: "UPI Transaction"
  },
  {
    id: "#SS-103",
    customerName: "Priya Desai",
    items: [
      {
        id: "royal-jaipur-suite",
        title: "Save the Date Cards",
        quantity: 250,
        details: "Royal Jaipur Theme",
        price: 85000,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOmhvmGV_UWWxZ6sg7X0Z_fGc2Gm-8N50EBioxXc9yEt2IwIkMUVWSZBpGieFsqEj55XWquDNkQeyh8qJIp0e6a6V11pDuK85FzeGHEau0fLa3srNhUaAmWBCJfTEN3aBK7pJPURACwcHUbT7RFJpiNTpYz399JSVjEI9PX6IWUishjdvhM6NSmenWfhkgs-N99in9U40KZdel4m0S1vFDoSGqn6-EwVXStkG8dyqW2gnVG7BtVcnM-c7W-RJt6PlU5j2xHbaQ"
      }
    ],
    total: 85000,
    currency: "INR",
    totalFormatted: "₹85,000",
    status: "Shipped",
    date: "Oct 21, 2024",
    paymentMethod: "Visa ending 1109"
  },
  {
    id: "#SS-104",
    customerName: "Karan Singh",
    items: [
      {
        id: "heritage-enamel-pin-set",
        title: "Luxury Gift Hamper",
        quantity: 1,
        details: "Personalized Groomsmen Pins",
        price: 15500,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBPRKadwt4GHqK3Q21Z9oRpaNHbef5YA2alVRdgdix2IyhpXylpxRdLXeoy6XFTDbi_XBLthVL-X9hzuNYGCjWZW9rQSl61R3IVIBM6nZOaEx32QJ0F_aGAg3tIbGQt30NsH3JsrpiUBspiuuNWlWfCZ_z-iFp-WMtTpbmxxvnR1yZkkDIx_spMkK_JokWduOVJDrjWhXv-JOut_PW7EGO_83ToE3LpqiCpYLaYPMbTuin3OMSg7ASLBVlylLBil8-ke-o-Mkm"
      }
    ],
    total: 15500,
    currency: "INR",
    totalFormatted: "₹15,500",
    status: "Processing",
    date: "Oct 20, 2024",
    paymentMethod: "UPI Transaction"
  }
];

export const mockInitialReviews: Review[] = [
  {
    id: "r1",
    productId: "wedding-invitation-suite",
    author: "Meera Sen",
    rating: 5,
    comment: "The envelopes with the wax seal are absolutely spectacular. It feels like opening historical royal archives. 100% recommend!",
    date: "May 10, 2026",
    approved: true
  },
  {
    id: "r2",
    productId: "wedding-invitation-suite",
    author: "Kabir V.",
    rating: 4,
    comment: "Excellent card weight, print lettering is sharp. Gold borders look very professional. Delivery took a little long, but worth the wait.",
    date: "May 08, 2026",
    approved: true
  },
  {
    id: "r3",
    productId: "custom-gold-foil-cards",
    author: "Aditi G.",
    rating: 5,
    comment: "These were a huge hit as favors at our Sangeet. Everyone loved the gold foil look, and the card stock is very stiff and durable.",
    date: "May 12, 2026",
    approved: true
  },
  {
    id: "r4",
    productId: "lotus-vine-poker-set",
    author: "Vikram R.",
    rating: 5,
    comment: "Exquisite designs. The faces of the cards look artsy and custom. The linen coating makes shuffling very smooth.",
    date: "Apr 28, 2026",
    approved: true
  }
];

export const mockInitialCoupons: Coupon[] = [
  { code: "SMILES20", discountType: "percent", discountValue: 20, minOrderValue: 2000, active: true },
  { code: "WELCOME10", discountType: "percent", discountValue: 10, minOrderValue: 0, active: true },
  { code: "DIWALI50", discountType: "percent", discountValue: 50, minOrderValue: 10000, active: true },
  { code: "SAVEMORE", discountType: "fixed", discountValue: 1000, minOrderValue: 5000, active: true }
];

export const mockInitialNotifications: UserNotification[] = [
  {
    id: "n1",
    title: "Order Shipped!",
    message: "Your order #SS-103 has been shipped. Track your shipment inside your dashboard.",
    date: "May 24, 2026",
    read: false,
    type: "order"
  },
  {
    id: "n2",
    title: "Welcome Discount",
    message: "Thank you for joining Shuffling Smiles. Apply code WELCOME10 for 10% off your initial bag.",
    date: "May 25, 2026",
    read: true,
    type: "promo"
  },
  {
    id: "n3",
    title: "System Update",
    message: "We've upgraded our e-commerce checkout to support saved cards and multi-step shipping books.",
    date: "May 25, 2026",
    read: false,
    type: "system"
  }
];

export const mockActivityLogs: ActivityLog[] = [
  { id: "log-1", action: "Catalog: Added Crimson Peacock Edition", user: "Admin", timestamp: "May 25, 2026 14:30" },
  { id: "log-2", action: "System: Local dev server started listening", user: "System", timestamp: "May 25, 2026 18:45" },
  { id: "log-3", action: "Coupon: Created code DIWALI50", user: "Admin", timestamp: "May 25, 2026 19:12" },
  { id: "log-4", action: "Orders: Placed order #SS-101", user: "Aanya Sharma", timestamp: "May 25, 2026 21:04" }
];
