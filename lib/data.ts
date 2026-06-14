// ─────────────────────────────────────────────────────────────
// Content extracted from the Figma "hd" design — Kat & Perry's Kitchenette
// Product images live in /public/images and were exported from Figma.
// ─────────────────────────────────────────────────────────────

export const business = {
  name: "Kat & Perry's Kitchenette",
  short: "Kat & Perry's",
  email: "katandperryskitchenette@gmail.com",
  phone: "+63 990 098 7378",
  address:
    "Cabarubbias St. San Jose Village, Tisa Cebu City, Cebu City, Philippines, 6000",
  city: "Tisa, Cebu City",
  mapsUrl:
    "https://maps.google.com/?q=Cabarubbias+St+San+Jose+Village+Tisa+Cebu+City",
  social: {
    instagram: "https://www.instagram.com/katandperryskitchenette/",
    facebook: "https://www.instagram.com/katandperryskitchenette/",
    tiktok: "https://www.tiktok.com/@katandperryskitchenette",
  },
};

export type Branch = {
  name: string;
  tag: string;
  address: string;
  mapsUrl: string;
  embedUrl: string;
  image: string;
};

export const branches: Branch[] = [
  {
    name: "Tisa",
    tag: "The original",
    address: "Cabarrubias St. San Jose, Tisa, Cebu City, 6000 Cebu",
    mapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Cabarrubias+St.+San+Jose,+Tisa,+Cebu+City,+6000+Cebu",
    embedUrl:
      "https://www.google.com/maps?q=Cabarrubias+St.+San+Jose,+Tisa,+Cebu+City,+6000+Cebu&output=embed",
    image: "/images/branch-tisa.jpg",
  },
  {
    name: "Mandaue",
    tag: "The newest",
    address: "M. L. Quezon Ave, Casuntingan, Mandaue, 6014 Cebu",
    mapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=M.+L.+Quezon+Ave,+Casuntingan,+Mandaue,+6014+Cebu",
    embedUrl:
      "https://www.google.com/maps?q=M.+L.+Quezon+Ave,+Casuntingan,+Mandaue,+6014+Cebu&output=embed",
    image: "/images/branch-mandaue.jpg",
  },
];

export type Drink = {
  name: string;
  price: string;
  description: string;
  image: string;
};

// Brown Sugar Cinnamon carries the exact copy from the Figma feature card.
// The remaining five names/prices are inferred from the product photos and
// should be confirmed against the real menu.
export const drinks: Drink[] = [
  {
    name: "Brown Sugar Cinnamon",
    price: "175.00",
    description:
      "A warm and comforting blend of rich espresso, steamed milk, sweet brown sugar, and a hint of cinnamon, perfectly balanced to wrap you in cozy café vibes with every sip.",
    image: "/images/menu-featured.png",
  },
  {
    name: "Cookies & Cream",
    price: "175.00",
    description:
      "Crushed cookies blended into smooth, creamy iced coffee, finished with whipped cream and a whole Oreo on top.",
    image: "/images/coffee-2.png",
  },
  {
    name: "Biscoff Caramel",
    price: "175.00",
    description:
      "Layers of caramel and Biscoff spread folded through iced coffee, crowned with cream and a buttery Lotus biscuit.",
    image: "/images/coffee-3.png",
  },
  {
    name: "Strawberries & Cream",
    price: "175.00",
    description:
      "Sweet strawberry purée swirled with velvety milk and cream — fruity, refreshing, and easy to love.",
    image: "/images/coffee-4.png",
  },
  {
    name: "Matcha Latte",
    price: "175.00",
    description:
      "Stone-ground Japanese matcha whisked with fresh milk for an earthy, vibrant green tea latte.",
    image: "/images/coffee-5.png",
  },
  {
    name: "Coffee Jelly Overload",
    price: "175.00",
    description:
      "Coffee jelly, leche flan, and banana layered into a rich, indulgent blended treat — dessert in a cup.",
    image: "/images/coffee-6.png",
  },
];

export type Testimonial = {
  name: string;
  rating: string;
  headline: string;
  body: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Angela M.",
    rating: "5.0",
    headline: "The coffee is next-level.",
    body: "Smooth, bold, and aromatic. Pair it with their freshly made donuts and it's heaven in every bite!",
  },
  {
    name: "Nina V.",
    rating: "5.0",
    headline: "Best café in town!",
    body: "Their cakes are fluffy, donuts are freshly baked, and the cappuccino is always on point.",
  },
  {
    name: "Mark E.",
    rating: "5.0",
    headline: "Every visit feels like a treat.",
    body: "Whether I'm craving for a donut or a slice of matcha burnt cake, they never disappoint.",
  },
];

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "Do you have space for dine-in customers?",
    a: "We do have small space for dine-in that can accommodate 10 – 15 people only.",
  },
  {
    q: "Is there parking area?",
    a: "There is one car parking area space inside. Motorcycles can park in front of the store.",
  },
  {
    q: "Do you have other branch?",
    a: "Yes! We now have two branches — the original in Tisa, Cebu City, and our newest store along M. L. Quezon Ave, Casuntingan, Mandaue City.",
  },
  {
    q: "What payment method do you accept?",
    a: "We accept cash, Gcash, and bank transfer.",
  },
  {
    q: "Do you sell per piece of your donuts and slice of cake?",
    a: "We do, you can buy per piece or per slice.",
  },
];
