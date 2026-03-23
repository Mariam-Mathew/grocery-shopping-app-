export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  subtotal?: number;
  store: string;
  notes?: string;
  checked: boolean;
  createdAt: Date;
}

export interface ShoppingList {
  id: string;
  name: string;
  description?: string;
  store: string;
  items: ShoppingItem[];
  totalBudget?: number;
  shared: boolean;
  sharedWith?: string[];
  createdAt: Date;
  updatedAt: Date;
  color: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  logo: string;
}

export const CATEGORIES = [
  "Produce",
  "Dairy & Eggs",
  "Meat & Fish",
  "Bakery",
  "Pantry",
  "Beverages",
  "Frozen",
  "Snacks",
  "Household",
  "Personal Care",
  "Other",
];

export const UNITS = [
  "pcs",
  "lbs",
  "kg",
  "oz",
  "g",
  "L",
  "mL",
  "dozen",
  "pack",
  "bottle",
];

export const STORES: Store[] = [
  {
    id: "1",
    name: "Whole Foods Market",
    address: "123 Main St",
    distance: "0.5 mi",
    rating: 4.5,
    logo: "🛒",
  },
  {
    id: "2",
    name: "Trader Joe's",
    address: "456 Oak Ave",
    distance: "1.2 mi",
    rating: 4.7,
    logo: "🥦",
  },
  {
    id: "3",
    name: "Costco",
    address: "789 Elm St",
    distance: "2.3 mi",
    rating: 4.3,
    logo: "📦",
  },
  {
    id: "4",
    name: "Target",
    address: "321 Pine Rd",
    distance: "1.8 mi",
    rating: 4.4,
    logo: "🎯",
  },
];

export const LIST_COLORS = [
  "#4CAF50",
  "#2196F3",
  "#FF9800",
  "#9C27B0",
  "#F44336",
  "#00BCD4",
  "#FFC107",
  "#795548",
];
