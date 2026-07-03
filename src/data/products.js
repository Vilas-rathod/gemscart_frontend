// ================================================
// LUXE JEWELLERY — Product Data
// ================================================

export const categories = [
  {
    id: 1,
    name: "Diamond Rings",
    slug: "diamond-rings",
    count: 48,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
    description: "Eternal sparkle, timeless design"
  },
  {
    id: 2,
    name: "Necklaces",
    slug: "necklaces",
    count: 62,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
    description: "Adorn your neckline with grace"
  },
  {
    id: 3,
    name: "Bangles",
    slug: "bangles",
    count: 35,
    image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80",
    description: "Stacked stories on your wrist"
  },
  {
    id: 4,
    name: "Bracelets",
    slug: "bracelets",
    count: 29,
    image: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&q=80",
    description: "Delicate threads of gold"
  },
  {
    id: 5,
    name: "Earrings",
    slug: "earrings",
    count: 74,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
    description: "Frame your face with brilliance"
  },
  {
    id: 6,
    name: "Mangalsutra",
    slug: "mangalsutra",
    count: 22,
    image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&q=80",
    description: "Sacred bonds, modern beauty"
  },
  {
    id: 7,
    name: "Pendant Sets",
    slug: "pendant-sets",
    count: 41,
    image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80",
    description: "Curated sets for every occasion"
  },
  {
    id: 8,
    name: "Bridal Collection",
    slug: "bridal-collection",
    count: 18,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    description: "For your most memorable day"
  }
];

export const products = [
  {
    id: 1,
    name: "Premium Diamond Solitaire Ring",
    slug: "premium-diamond-solitaire-ring",
    category: "diamond-rings",
    price: 28500,
    originalPrice: 35000,
    discount: 18,
    rating: 4.8,
    reviews: 124,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
      "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80"
    ],
    badge: "Best Seller",
    isNew: false,
    inStock: true,
    metal: "18K White Gold",
    stone: "Diamond (0.75 ct)",
    description: "A breathtaking solitaire that captures light from every angle. Set in 18K white gold with a brilliant-cut diamond, this ring is the epitome of timeless elegance.",
    details: [
      "Metal: 18K White Gold",
      "Stone: Natural Diamond 0.75 ct",
      "Clarity: VS1",
      "Colour: F",
      "Setting: 4-prong solitaire",
      "Ring Size: Customisable"
    ],
    sizes: ["5", "6", "7", "8", "9"]
  },
  {
    id: 2,
    name: "Heirloom Pearl Drop Necklace",
    slug: "heirloom-pearl-drop-necklace",
    category: "necklaces",
    price: 12800,
    originalPrice: 16000,
    discount: 20,
    rating: 4.9,
    reviews: 87,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80"
    ],
    badge: "New",
    isNew: true,
    inStock: true,
    metal: "22K Gold",
    stone: "South Sea Pearl",
    description: "Inspired by heirloom pieces passed through generations. Lustrous South Sea pearls suspended from handcrafted 22K gold links — a necklace that tells a story.",
    details: [
      "Metal: 22K Yellow Gold",
      "Stone: South Sea Pearl",
      "Pearl Size: 10–12mm",
      "Chain Length: 18 inches",
      "Closure: Lobster clasp"
    ],
    sizes: []
  },
  {
    id: 3,
    name: "Eternity Diamond Bangle",
    slug: "eternity-diamond-bangle",
    category: "bangles",
    price: 45000,
    originalPrice: 52000,
    discount: 13,
    rating: 4.7,
    reviews: 56,
    images: [
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800&q=80"
    ],
    badge: "Limited",
    isNew: false,
    inStock: true,
    metal: "18K Rose Gold",
    stone: "Diamonds",
    description: "An unbroken circle of brilliant diamonds set in warm rose gold. The eternity bangle symbolises endless love and is crafted for the woman who deserves forever.",
    details: [
      "Metal: 18K Rose Gold",
      "Diamond Weight: 1.20 ct total",
      "Setting: Channel set",
      "Inner Diameter: 2.5 inches",
      "Finish: High polish"
    ],
    sizes: ["2.4", "2.5", "2.6", "2.8"]
  },
  {
    id: 4,
    name: "Enchanted Emerald Pendant Set",
    slug: "enchanted-emerald-pendant-set",
    category: "pendant-sets",
    price: 18900,
    originalPrice: 22000,
    discount: 14,
    rating: 4.6,
    reviews: 43,
    images: [
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80"
    ],
    badge: "Sale",
    isNew: false,
    inStock: true,
    metal: "18K Yellow Gold",
    stone: "Colombian Emerald",
    description: "Vivid Colombian emeralds encased in hand-engraved 18K gold. The pendant and matching earrings create a complete look of regal sophistication.",
    details: [
      "Metal: 18K Yellow Gold",
      "Stone: Colombian Emerald",
      "Emerald Weight: 3.2 ct",
      "Includes: Pendant + Earrings",
      "Chain: 18 inches, adjustable"
    ],
    sizes: []
  },
  {
    id: 5,
    name: "Celestial Diamond Earrings",
    slug: "celestial-diamond-earrings",
    category: "earrings",
    price: 9800,
    originalPrice: 12000,
    discount: 18,
    rating: 4.9,
    reviews: 211,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800&q=80"
    ],
    badge: "Best Seller",
    isNew: false,
    inStock: true,
    metal: "14K White Gold",
    stone: "Diamond",
    description: "Star-shaped studs featuring a central diamond encircled by eight brilliant-cut stones. Celestial beauty you can wear every day.",
    details: [
      "Metal: 14K White Gold",
      "Diamond Weight: 0.40 ct each",
      "Clarity: SI1",
      "Colour: G-H",
      "Closure: Push-back"
    ],
    sizes: []
  },
  {
    id: 6,
    name: "Heritage Gold Mangalsutra",
    slug: "heritage-gold-mangalsutra",
    category: "mangalsutra",
    price: 34200,
    originalPrice: 40000,
    discount: 14,
    rating: 4.8,
    reviews: 92,
    images: [
      "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
    ],
    badge: "Trending",
    isNew: false,
    inStock: true,
    metal: "22K Gold",
    stone: "Black Beads + Diamond",
    description: "A contemporary reimagining of the sacred mangalsutra. Handstrung black beads lead to an artisan-crafted 22K gold pendant with a central diamond.",
    details: [
      "Metal: 22K Yellow Gold",
      "Pendant Stone: Diamond 0.15 ct",
      "Chain: Black beads + gold",
      "Length: 18 inches",
      "Certification: BIS Hallmarked"
    ],
    sizes: []
  },
  {
    id: 7,
    name: "Sapphire Tennis Bracelet",
    slug: "sapphire-tennis-bracelet",
    category: "bracelets",
    price: 22500,
    originalPrice: 28000,
    discount: 20,
    rating: 4.7,
    reviews: 68,
    images: [
      "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800&q=80",
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80"
    ],
    badge: "New",
    isNew: true,
    inStock: true,
    metal: "18K White Gold",
    stone: "Blue Sapphire",
    description: "Alternating sapphires and diamonds set in a sleek 18K white gold band. This tennis bracelet radiates cool, confident luxury on every wrist.",
    details: [
      "Metal: 18K White Gold",
      "Sapphires: 3.60 ct total",
      "Diamonds: 1.20 ct total",
      "Length: 7 inches",
      "Closure: Box clasp with safety"
    ],
    sizes: ["6.5 inch", "7 inch", "7.5 inch"]
  },
  {
    id: 8,
    name: "Bridal Kundan Choker Set",
    slug: "bridal-kundan-choker-set",
    category: "bridal-collection",
    price: 68000,
    originalPrice: 82000,
    discount: 17,
    rating: 5.0,
    reviews: 34,
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
      "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&q=80"
    ],
    badge: "Exclusive",
    isNew: false,
    inStock: true,
    metal: "22K Gold",
    stone: "Kundan + Ruby + Emerald",
    description: "A masterwork of traditional Kundan craftsmanship elevated for the modern bride. Rubies, emeralds, and polki diamonds set in hand-applied lac work — utterly extraordinary.",
    details: [
      "Metal: 22K Gold",
      "Stones: Kundan, Ruby, Emerald, Polki",
      "Includes: Choker + Earrings + Maang Tikka",
      "Weight: Approx. 120g",
      "Handcrafted: Jaipur artisans"
    ],
    sizes: []
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "The diamond solitaire ring I ordered exceeded every expectation. The craftsmanship is extraordinary — my husband proposed with it and I've never taken it off.",
    product: "Premium Diamond Solitaire Ring"
  },
  {
    id: 2,
    name: "Ananya Reddy",
    location: "Hyderabad",
    rating: 5,
    text: "LUXE turned my wedding into a fairy tale. The bridal choker set was the centrepiece of my look and every guest wanted to know where it came from.",
    product: "Bridal Kundan Choker Set"
  },
  {
    id: 3,
    name: "Meera Iyer",
    location: "Bangalore",
    rating: 5,
    text: "I gifted myself the sapphire tennis bracelet for my 40th birthday. Wearing it feels like carrying a tiny piece of art on my wrist every day.",
    product: "Sapphire Tennis Bracelet"
  }
];

export const navLinks = [
  { label: "New Arrivals", path: "/shop?filter=new" },
  { label: "Necklaces", path: "/shop?category=necklaces" },
  { label: "Earrings", path: "/shop?category=earrings" },
  { label: "Rings", path: "/shop?category=diamond-rings" },
  { label: "Bracelets", path: "/shop?category=bracelets" },
  { label: "Wedding Collection", path: "/shop?category=bridal-collection" },
  { label: "Collections", path: "/shop" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" }
];
