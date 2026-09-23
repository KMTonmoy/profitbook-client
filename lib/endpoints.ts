import { api } from "@/lib/api";
import type {
  Product,
  Category,
  Supplier,
  Customer,
  Sale,
  Due,
  Expense,
  StockMovement,
  BusinessSettings,
} from "@/lib/types";

export const endpoints = {
  categories: {
    list: () => api.get<Category[]>("/api/categories"),
    create: (b: Omit<Category, "id">) =>
      api.post<Category>("/api/categories", b),
    update: (id: string, b: Partial<Category>) =>
      api.patch<Category>(`/api/categories/${id}`, b),
    remove: (id: string) => api.del(`/api/categories/${id}`),
  },
  products: {
    list: () => api.get<Product[]>("/api/products"),
    one: (id: string) => api.get<Product>(`/api/products/${id}`),
    low: () => api.get<Product[]>("/api/products/low-stock"),
    create: (b: Omit<Product, "id">) => api.post<Product>("/api/products", b),
    update: (id: string, b: Partial<Product>) =>
      api.patch<Product>(`/api/products/${id}`, b),
    remove: (id: string) => api.del(`/api/products/${id}`),
  },
  suppliers: {
    list: () => api.get<Supplier[]>("/api/suppliers"),
    create: (b: Omit<Supplier, "id">) =>
      api.post<Supplier>("/api/suppliers", b),
    update: (id: string, b: Partial<Supplier>) =>
      api.patch<Supplier>(`/api/suppliers/${id}`, b),
    remove: (id: string) => api.del(`/api/suppliers/${id}`),
  },
  customers: {
    list: () => api.get<Customer[]>("/api/customers"),
    one: (id: string) => api.get<Customer>(`/api/customers/${id}`),
    history: (id: string) => api.get(`/api/customers/${id}/history`),
    create: (b: Omit<Customer, "id">) =>
      api.post<Customer>("/api/customers", b),
    update: (id: string, b: Partial<Customer>) =>
      api.patch<Customer>(`/api/customers/${id}`, b),
    remove: (id: string) => api.del(`/api/customers/${id}`),
  },
  sales: {
    list: () => api.get<Sale[]>("/api/sales"),
    one: (id: string) => api.get<Sale>(`/api/sales/${id}`),
    create: (b: Omit<Sale, "id">) => api.post<Sale>("/api/sales", b),
    update: (id: string, b: Partial<Sale>) =>
      api.patch<Sale>(`/api/sales/${id}`, b),
    remove: (id: string) => api.del(`/api/sales/${id}`),
  },
  purchases: {
    list: () => api.get("/api/purchases"),
    one: (id: string) => api.get(`/api/purchases/${id}`),
    create: (b: unknown) => api.post("/api/purchases", b),
    update: (id: string, b: unknown) => api.patch(`/api/purchases/${id}`, b),
    remove: (id: string) => api.del(`/api/purchases/${id}`),
  },
  expenses: {
    list: () => api.get<Expense[]>("/api/expenses"),
    create: (b: Omit<Expense, "id">) => api.post<Expense>("/api/expenses", b),
    update: (id: string, b: Partial<Expense>) =>
      api.patch<Expense>(`/api/expenses/${id}`, b),
    remove: (id: string) => api.del(`/api/expenses/${id}`),
  },
  dues: {
    list: () => api.get<Due[]>("/api/dues"),
    overdue: () => api.get<Due[]>("/api/dues/overdue"),
    create: (b: Omit<Due, "id">) => api.post<Due>("/api/dues", b),
    update: (id: string, b: Partial<Due>) =>
      api.patch<Due>(`/api/dues/${id}`, b),
    remove: (id: string) => api.del(`/api/dues/${id}`),
  },
  payments: {
    list: () => api.get("/api/payments"),
    create: (b: unknown) => api.post("/api/payments", b),
    remove: (id: string) => api.del(`/api/payments/${id}`),
  },
  stockMovements: {
    list: () => api.get<StockMovement[]>("/api/stock-movements"),
    byProduct: (productId: string) =>
      api.get<StockMovement[]>(`/api/stock-movements/${productId}`),
    create: (b: unknown) => api.post("/api/stock-movements", b),
  },
  settings: {
    get: () => api.get<BusinessSettings>("/api/settings"),
    save: (b: Partial<BusinessSettings>) =>
      api.put<BusinessSettings>("/api/settings", b),
  },
  statements: {
    generate: (from: string, to: string) =>
      api.post("/api/statements/generate", { from, to }),
  },
  reports: {
    sales: (from?: string, to?: string) =>
      api.get<Sale[]>("/api/reports/sales", { from, to }),
    purchases: (from?: string, to?: string) =>
      api.get("/api/reports/purchases", { from, to }),
    profit: (from?: string, to?: string) =>
      api.get("/api/reports/profit", { from, to }),
    expenses: (from?: string, to?: string) =>
      api.get("/api/reports/expenses", { from, to }),
    stock: () => api.get("/api/reports/stock"),
    dues: () => api.get<Customer[]>("/api/reports/dues"),
    products: () => api.get("/api/reports/products"),
  },
  dashboard: {
    summary: () => api.get("/api/dashboard/summary"),
    charts: (range: "7d" | "30d" | "6m" | "1y") =>
      api.get("/api/dashboard/charts", { range }),
    recentSales: () => api.get<Sale[]>("/api/dashboard/recent-sales"),
    recentDues: () => api.get<Due[]>("/api/dashboard/recent-dues"),
    lowStock: () => api.get<Product[]>("/api/dashboard/low-stock"),
    salesByCategory: () =>
      api.get<{ id: string; name: string; color: string; value: number }[]>(
        "/api/dashboard/sales-by-category",
      ),
  },
};
