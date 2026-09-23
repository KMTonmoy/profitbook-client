import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const http = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      "Request failed";
    return Promise.reject(new Error(message));
  },
);

export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    http.get<T>(url, { params }).then((r) => r.data),
  post: <T>(url: string, body?: unknown) =>
    http.post<T>(url, body).then((r) => r.data),
  patch: <T>(url: string, body?: unknown) =>
    http.patch<T>(url, body).then((r) => r.data),
  put: <T>(url: string, body?: unknown) =>
    http.put<T>(url, body).then((r) => r.data),
  del: <T>(url: string) => http.delete<T>(url).then((r) => r.data),
};

export { API_URL };
