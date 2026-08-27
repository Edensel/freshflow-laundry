export const businessConfig = {
  name: "Fresh Flow Cleaning & Garment Care",
  shortName: "Fresh Flow",
  domain: "freshflowslaundry.com",
  email: "orders@freshflowslaundry.com",
  staffEmail: "ops@freshflowslaundry.com",
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+254 789 920 270",
  address:
    process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ||
    "Nairobi, Kenya",
  city: "Nairobi",
  country: "Kenya",
  currency: "KES",
  serviceWindowLabel: "Mon-Fri 8:00-18:00, Sat 9:00-15:00",
  supportWindowLabel: "Email & phone support daily; pickup windows Monday to Saturday",
  slotCapacity: Number(process.env.NEXT_PUBLIC_SLOT_CAPACITY || 6),
  mpesa: {
    tillNumber: process.env.NEXT_PUBLIC_MPESA_TILL || "Till to confirm",
    paybillNumber:
      process.env.NEXT_PUBLIC_MPESA_PAYBILL || "Paybill to confirm",
    accountName:
      process.env.NEXT_PUBLIC_MPESA_ACCOUNT_NAME ||
      "Fresh Flow Services",
  },
} as const;

export const serviceAreas = [
  "Nairobi CBD",
  "Westlands",
  "Parklands",
  "Kilimani",
  "Kileleshwa",
  "Lavington",
  "Upper Hill",
  "Hurlingham",
  "South B",
  "South C",
  "Lang'ata",
  "Karen",
  "Rongai",
  "Runda",
  "Muthaiga",
  "Kasarani",
  "Embakasi",
  "Donholm",
] as const;

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/calculator", label: "Rate Calculator" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const statusSteps = [
  "NEW",
  "PICKED_UP",
  "IN_PROGRESS",
  "READY",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
] as const;

export const statusLabels: Record<(typeof statusSteps)[number], string> = {
  NEW: "New",
  PICKED_UP: "Picked up",
  IN_PROGRESS: "In progress",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for delivery",
  COMPLETED: "Completed",
};

export const paymentOptions = [
  {
    id: "mpesa_till",
    label: "M-Pesa Buy Goods",
    detail: `Till: ${businessConfig.mpesa.tillNumber}`,
  },
  {
    id: "mpesa_paybill",
    label: "M-Pesa Paybill",
    detail: `Paybill: ${businessConfig.mpesa.paybillNumber}`,
  },
  {
    id: "pay_on_delivery",
    label: "Pay on collection/delivery",
    detail: "Staff confirms availability before pickup.",
  },
] as const;

export type PaymentOption = (typeof paymentOptions)[number]["id"];

export function formatKes(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("KES", "KSh");
}

export function normalizeKenyanPhone(phone: string) {
  const compact = phone.replace(/[\s()-]/g, "");

  if (compact.startsWith("0")) {
    return `+254${compact.slice(1)}`;
  }

  if (compact.startsWith("254")) {
    return `+${compact}`;
  }

  return compact;
}

export function isSupportedServiceArea(input: string) {
  const normalized = input.trim().toLowerCase();

  if (!normalized) {
    return false;
  }

  return serviceAreas.some((area) => {
    const areaName = area.toLowerCase();
    return normalized.includes(areaName) || areaName.includes(normalized);
  });
}

export function paymentInstructions(option: PaymentOption) {
  if (option === "mpesa_till") {
    return [
      "Open M-Pesa and choose Buy Goods.",
      `Enter Till Number: ${businessConfig.mpesa.tillNumber}.`,
      `Use your Fresh Flow ticket ID as the payment note where available.`,
    ];
  }

  if (option === "mpesa_paybill") {
    return [
      "Open M-Pesa and choose Paybill.",
      `Enter Paybill Number: ${businessConfig.mpesa.paybillNumber}.`,
      `Use your Fresh Flow ticket ID as the account number.`,
    ];
  }

  return [
    "Payment will be collected by staff at pickup or delivery.",
    "Keep your Fresh Flow ticket ID ready when staff contact you.",
  ];
}
