export type ID = string;
export type PaymentStatus = "paid" | "partial" | "due" | "overdue";
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";
export type StockMovementType = "purchase" | "sale" | "return" | "adjustment";
export type ExpenseCategory =
  | "rent"
  | "electricity"
  | "salary"
  | "transport"
  | "maintenance"
  | "marketing"
  | "packaging"
  | "other";

export interface Category {
  id: ID;
  name: string;
  color?: string;
}
export interface Supplier {
  id: ID;
  name: string;
  phone: string;
  address: string;
  email?: string;
}
export interface Supplier {
  id: ID;
  name: string;
  phone: string;
  address: string;
  email?: string;
  agentName?: string;
  agentPhone?: string;
}
export interface Product {
  id: ID;
  name: string;
  sku: string;
  categoryId: ID;
  brand?: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  openingStock: number;
  currentStock: number;
  minimumStock: number;
  supplierId?: ID;
  description?: string;
  imageUrl?: string;
  status: StockStatus;
  createdAt: string;
}
export interface Customer {
  id: ID;
  name: string;
  phone: string;
  address: string;
  email?: string;
  notes?: string;
  totalPurchases: number;
  totalPaid: number;
  totalDue: number;
  lastPurchaseDate?: string;
  status: "active" | "inactive";
  createdAt: string;
}
export interface PurchaseItem {
  id: ID;
  productId: ID;
  productName: string;
  quantity: number;
  purchasePrice: number;
  subtotal: number;
}
export interface Purchase {
  id: ID;
  purchaseNumber: string;
  supplierId: ID;
  supplierName: string;
  date: string;
  items: PurchaseItem[];
  subtotal: number;
  discount: number;
  additionalCost: number;
  total: number;
  paid: number;
  due: number;
  status: PaymentStatus;
}
export interface SaleItem {
  id: ID;
  productId: ID;
  productName: string;
  quantity: number;
  sellingPrice: number;
  purchasePrice: number;
  discount: number;
  subtotal: number;
  profit: number;
}
export interface Sale {
  id: ID;
  invoiceNumber: string;
  customerId: ID;
  customerName: string;
  date: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paid: number;
  due: number;
  profit: number;
  status: PaymentStatus;
  dueDate?: string;
}
export interface Payment {
  id: ID;
  customerId: ID;
  saleId?: ID;
  invoiceNumber?: string;
  amount: number;
  method: "cash" | "bkash" | "nagad" | "bank" | "card";
  date: string;
  note?: string;
}
export interface Due {
  id: ID;
  customerId: ID;
  customerName: string;
  saleId: ID;
  invoiceNumber: string;
  saleDate: string;
  totalAmount: number;
  paid: number;
  due: number;
  dueDate: string;
  status: PaymentStatus;
}
export interface Expense {
  id: ID;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: "cash" | "bkash" | "nagad" | "bank" | "card";
  date: string;
}
export interface StockMovement {
  id: ID;
  date: string;
  productId: ID;
  productName: string;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reference: string;
  user: string;
}
export interface BusinessSettings {
  businessName: string;
  ownerName: string;
  phone: string;
  address: string;
  email: string;
  logoUrl?: string;
  invoicePrefix: string;
  paymentTerms: number;
  invoiceFooter: string;
  currency: string;
  theme: "light" | "dark" | "compact";
}
