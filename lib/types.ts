export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "hold",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "পেন্ডিং",
  confirmed: "কনফার্মড",
  processing: "প্রসেসিং",
  hold: "হোল্ড",
  shipped: "শিপড",
  delivered: "ডেলিভারড",
  cancelled: "ক্যানসেলড",
  returned: "রিটার্নড",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  hold: "bg-slate-200 text-slate-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  returned: "bg-orange-100 text-orange-800",
};

export type DeliveryArea = "inside" | "outside";

export interface CourierInfo {
  provider: "steadfast";
  consignmentId: string;
  trackingCode: string;
  status: string;
  sentAt: string;
  checkedAt?: string;
}

export interface Order {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  phone: string;
  address: string;
  area: DeliveryArea;
  quantity: number;
  unitPrice: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  status: OrderStatus;
  note: string;
  adminNote: string;
  ip: string;
  userAgent: string;
  source: "landing" | "incomplete" | "manual";
  packageLabel?: string;
  courier?: CourierInfo;
  history: { at: string; status: OrderStatus; note?: string }[];
}

export interface IncompleteOrder {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  phone: string;
  address: string;
  area: DeliveryArea;
  quantity: number;
  ip: string;
}

export interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  avatar: string;
}

export interface ProductPackage {
  id: string;
  label: string;
  quantity: number;
  /** Total price for the whole package, before delivery. */
  price: number;
}

export interface Settings {
  product: {
    name: string;
    price: number;
    regularPrice: number;
    stock: number;
    sku: string;
    image: string;
    maxQuantity: number;
    packages: ProductPackage[];
  };
  delivery: {
    inside: number;
    outside: number;
    insideLabel: string;
    outsideLabel: string;
    freeDeliveryMinQty: number;
  };
  content: {
    siteTitle: string;
    heroTitleColored: string;
    heroTitleDark: string;
    heroSubtitle: string;
    heroImage: string;
    beforeAfterImage: string;
    tagline: string;
    ctaText: string;
    noticeBar: string;
    phone: string;
    whatsapp: string;
    facebookPage: string;
    footerText: string;
    thankYouMessage: string;
    orderFormTitle: string;
    paymentNote: string;
  };
  reviews: Review[];
  marketing: {
    pixelId: string;
    capiToken: string;
    testEventCode: string;
    gtmId: string;
  };
  courier: {
    steadfastApiKey: string;
    steadfastSecretKey: string;
    autoSendOnConfirm: boolean;
  };
  security: {
    blockedPhones: string[];
    blockedIps: string[];
    duplicateWindowMinutes: number;
  };
}

export interface AdminAuth {
  passwordHash: string;
  sessionSecret: string;
}

export interface DB {
  nextOrderId: number;
  orders: Order[];
  incomplete: IncompleteOrder[];
  settings: Settings;
  admin: AdminAuth;
}

/** Settings with secrets removed, safe to send to the browser on the public site. */
export type PublicSettings = Omit<Settings, "courier" | "security" | "marketing"> & {
  marketing: Pick<Settings["marketing"], "pixelId" | "gtmId">;
};
