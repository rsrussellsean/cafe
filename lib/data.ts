export type MenuItem = {
  name: string;
  description: string;
  price: string;
  image: string;
};

export type MenuSection = {
  label: string;
  items: MenuItem[];
};

const u = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const img = {
  heroCup: u("photo-1495474472287-4d71bcdd2085", 1200),
  pour: u("photo-1442512595331-e89e73853f31", 1200),
  interior: u("photo-1554118811-1e0d58224f24", 1400),
  beans: u("photo-1447933601403-0c6688de566e", 1200),
  latteArt: u("photo-1525610553991-2bede1a236e2"),
  window: u("photo-1453614512568-c4024d13c247", 1400),
  croissant: u("photo-1555507036-ab1f4038808a"),
  bread: u("photo-1509440159596-0249088772ff"),
  espresso: u("photo-1510591509098-f4fdc6d0ff04"),
  coldBrew: u("photo-1461023058943-07fcbe16d735"),
  matcha: u("photo-1515823064-d6e0c04616a7"),
  cake: u("photo-1578985545062-69928b1d9587"),
  friends: u("photo-1521017432531-fbd92d768814", 1400),
  barista: u("photo-1559925393-8be0ec4767c8", 1400),
};

export const menu: MenuSection[] = [
  {
    label: "Coffee",
    items: [
      {
        name: "Espresso",
        description: "double shot · seasonal single origin",
        price: "120",
        image: img.espresso,
      },
      {
        name: "Flat White",
        description: "ristretto base · velvet milk",
        price: "170",
        image: img.latteArt,
      },
      {
        name: "Pour Over",
        description: "hand-brewed · rotating roaster series",
        price: "190",
        image: img.pour,
      },
      {
        name: "Cold Brew",
        description: "18-hour steep · black or tonic",
        price: "180",
        image: img.coldBrew,
      },
    ],
  },
  {
    label: "Not Coffee",
    items: [
      {
        name: "Ceremonial Matcha",
        description: "whisked to order · oat or fresh milk",
        price: "210",
        image: img.matcha,
      },
      {
        name: "Spanish Latte (Decaf)",
        description: "condensed milk · all the comfort, none of the jitters",
        price: "180",
        image: img.heroCup,
      },
    ],
  },
  {
    label: "Bakehouse",
    items: [
      {
        name: "Burnt Butter Croissant",
        description: "72-hour laminated · out of the oven at 7am",
        price: "150",
        image: img.croissant,
      },
      {
        name: "Country Sourdough",
        description: "whole loaf · stone-milled flour · natural levain",
        price: "320",
        image: img.bread,
      },
      {
        name: "Basque Cheesecake",
        description: "burnt top · molten center · by the slice",
        price: "220",
        image: img.cake,
      },
    ],
  },
];

export const hours = [
  { days: "Mon — Thu", time: "7:00 — 18:00" },
  { days: "Fri", time: "7:00 — 22:00" },
  { days: "Sat — Sun", time: "8:00 — 22:00" },
];
