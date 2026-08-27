export type ServiceCategory =
  | "laundry"
  | "house_cleaning"
  | "carpet_cleaning"
  | "fumigation";

export type ServiceItem = {
  id: string;
  category: ServiceCategory;
  categoryName: string;
  name: string;
  unit: string;
  priceKe: number;
  minimumQty: number;
  step: number;
  popular?: boolean;
  description: string;
};

export const serviceCategories: { id: ServiceCategory; name: string; icon: string }[] = [
  { id: "laundry", name: "Laundry & Dry Cleaning", icon: "🧺" },
  { id: "house_cleaning", name: "House Cleaning", icon: "🧹" },
  { id: "carpet_cleaning", name: "Carpet Cleaning", icon: "🛋️" },
  { id: "fumigation", name: "Pest & Fumigation", icon: "🪲" },
];

export const serviceCatalog: ServiceItem[] = [
  // LAUNDRY SERVICES
  {
    id: "wash_fold",
    category: "laundry",
    categoryName: "Laundry",
    name: "Wash & Fold",
    unit: "kg",
    priceKe: 130,
    minimumQty: 5,
    step: 1,
    popular: true,
    description: "Everyday clothes washed with eco detergent, tumble dried, and neatly folded.",
  },
  {
    id: "wash_iron_fold",
    category: "laundry",
    categoryName: "Laundry",
    name: "Wash, Iron & Fold",
    unit: "kg",
    priceKe: 180,
    minimumQty: 5,
    step: 1,
    popular: true,
    description: "Full laundry service with steam pressing and crisp folding.",
  },
  {
    id: "ironing",
    category: "laundry",
    categoryName: "Laundry",
    name: "Ironing Only",
    unit: "item",
    priceKe: 50,
    minimumQty: 5,
    step: 1,
    description: "Professional steam pressing for shirts, trousers, and dresses.",
  },
  {
    id: "duvets",
    category: "laundry",
    categoryName: "Laundry",
    name: "Duvets & Heavy Comforters",
    unit: "item",
    priceKe: 500,
    minimumQty: 1,
    step: 1,
    popular: true,
    description: "Deep hypoallergenic thermal wash and fluffing for heavy blankets & duvets.",
  },
  {
    id: "bedding",
    category: "laundry",
    categoryName: "Laundry",
    name: "Bedding & Sheets",
    unit: "item",
    priceKe: 100,
    minimumQty: 1,
    step: 1,
    description: "Bed sheets, pillowcases, and duvet covers washed & sanitized.",
  },

  // HOUSE CLEANING SERVICES
  {
    id: "house_bedseater",
    category: "house_cleaning",
    categoryName: "House Cleaning",
    name: "Bedseater House Cleaning",
    unit: "unit",
    priceKe: 700,
    minimumQty: 1,
    step: 1,
    description: "Complete studio/bedseater deep cleaning including kitchenette & bathroom.",
  },
  {
    id: "house_1bd",
    category: "house_cleaning",
    categoryName: "House Cleaning",
    name: "1 Bedroom House Cleaning",
    unit: "unit",
    priceKe: 1400,
    minimumQty: 1,
    step: 1,
    popular: true,
    description: "Full 1-bedroom apartment cleaning, dusting, scrubbing, & floor sanitization.",
  },
  {
    id: "house_2bd",
    category: "house_cleaning",
    categoryName: "House Cleaning",
    name: "2 Bedroom House Cleaning",
    unit: "unit",
    priceKe: 2100,
    minimumQty: 1,
    step: 1,
    popular: true,
    description: "Deep house cleaning for 2-bedroom homes, living areas, kitchen & bathrooms.",
  },
  {
    id: "house_3bd",
    category: "house_cleaning",
    categoryName: "House Cleaning",
    name: "3 Bedroom House Cleaning",
    unit: "unit",
    priceKe: 2800,
    minimumQty: 1,
    step: 1,
    description: "Comprehensive home cleaning for 3-bedroom houses or maisonettes.",
  },

  // CARPET CLEANING SERVICES
  {
    id: "carpet_small",
    category: "carpet_cleaning",
    categoryName: "Carpet Cleaning",
    name: "Small Carpet (up to 4×6 ft)",
    unit: "item",
    priceKe: 550,
    minimumQty: 1,
    step: 1,
    description: "Stain extraction & deep shampooing for small rugs and door mats.",
  },
  {
    id: "carpet_medium",
    category: "carpet_cleaning",
    categoryName: "Carpet Cleaning",
    name: "Medium Carpet (5×8 ft)",
    unit: "item",
    priceKe: 650,
    minimumQty: 1,
    step: 1,
    popular: true,
    description: "Deep foam shampooing and fiber sanitization for medium living room carpets.",
  },
  {
    id: "carpet_large",
    category: "carpet_cleaning",
    categoryName: "Carpet Cleaning",
    name: "Large Carpet (6×9 ft)",
    unit: "item",
    priceKe: 750,
    minimumQty: 1,
    step: 1,
    popular: true,
    description: "Heavy duty dirt extraction and odor neutralization for large carpets.",
  },
  {
    id: "carpet_xlarge",
    category: "carpet_cleaning",
    categoryName: "Carpet Cleaning",
    name: "Extra Large Carpet (8×11+ ft)",
    unit: "item",
    priceKe: 1000,
    minimumQty: 1,
    step: 1,
    description: "Industrial deep steam cleaning for extra large wall-to-wall carpets & area rugs.",
  },

  // FUMIGATION SERVICES
  {
    id: "fumigation_bedseater",
    category: "fumigation",
    categoryName: "Pest & Fumigation",
    name: "Bedseater Fumigation",
    unit: "service",
    priceKe: 2500,
    minimumQty: 1,
    step: 1,
    description: "Targeted pest eradication (bedbugs, cockroaches, ants) for studio units.",
  },
  {
    id: "fumigation_1bd",
    category: "fumigation",
    categoryName: "Pest & Fumigation",
    name: "1 Bedroom Fumigation",
    unit: "service",
    priceKe: 3500,
    minimumQty: 1,
    step: 1,
    popular: true,
    description: "Full pest control treatment for 1-bedroom apartments with 60-day guarantee.",
  },
  {
    id: "fumigation_2bd",
    category: "fumigation",
    categoryName: "Pest & Fumigation",
    name: "2 Bedroom Fumigation",
    unit: "service",
    priceKe: 4500,
    minimumQty: 1,
    step: 1,
    popular: true,
    description: "Complete odor-free fumigation for 2-bedroom residences.",
  },
  {
    id: "fumigation_3bd",
    category: "fumigation",
    categoryName: "Pest & Fumigation",
    name: "3 Bedroom Fumigation",
    unit: "service",
    priceKe: 5500,
    minimumQty: 1,
    step: 1,
    description: "Comprehensive pest elimination for 3-bedroom family houses.",
  },
  {
    id: "fumigation_4bd",
    category: "fumigation",
    categoryName: "Pest & Fumigation",
    name: "4 Bedroom Fumigation",
    unit: "service",
    priceKe: 6500,
    minimumQty: 1,
    step: 1,
    description: "Heavy-duty full property pest eradication for large homes or commercial spaces.",
  },
];

export type ServiceId = (typeof serviceCatalog)[number]["id"];

export type SelectedServiceInput = {
  id: string;
  quantity: number;
};

export type QuoteLine = {
  id: string;
  category: ServiceCategory;
  name: string;
  unit: string;
  quantity: number;
  priceKe: number;
  lineTotalKe: number;
};

export type Quote = {
  lines: QuoteLine[];
  subtotalKe: number;
  pickupDeliveryKe: number;
  totalKe: number;
  requiresQuote: boolean;
};

export function calculateQuote(items: SelectedServiceInput[]): Quote {
  const lines: QuoteLine[] = [];
  let subtotalKe = 0;

  for (const item of items) {
    const service = serviceCatalog.find((s) => s.id === item.id);
    if (!service || item.quantity <= 0) continue;

    const actualQty = Math.max(item.quantity, service.minimumQty);
    const lineTotal = actualQty * service.priceKe;

    lines.push({
      id: service.id,
      category: service.category,
      name: service.name,
      unit: service.unit,
      quantity: actualQty,
      priceKe: service.priceKe,
      lineTotalKe: lineTotal,
    });

    subtotalKe += lineTotal;
  }

  // Free delivery for orders over KSh 2,500, else KSh 250 standard delivery
  const pickupDeliveryKe = subtotalKe >= 2500 || subtotalKe === 0 ? 0 : 250;
  const totalKe = subtotalKe > 0 ? subtotalKe + pickupDeliveryKe : 0;

  return {
    lines,
    subtotalKe,
    pickupDeliveryKe,
    totalKe,
    requiresQuote: false,
  };
}
