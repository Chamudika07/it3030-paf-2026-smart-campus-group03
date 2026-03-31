import axios from "axios";

const STORAGE_KEY = "smart-campus-user";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api"
});

http.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem(STORAGE_KEY);
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser) as { name?: string; role?: string };
    if (parsedUser.name) {
      config.headers.set("X-User-Name", parsedUser.name);
      config.headers.set("X-User-Id", parsedUser.name.toLowerCase().replace(/\s+/g, "-"));
    }
    if (parsedUser.role) {
      config.headers.set("X-User-Role", parsedUser.role);
    }
  }

  if (!(config.data instanceof FormData) && !config.headers.has("Content-Type")) {
    config.headers.set("Content-Type", "application/json");
  }

  return config;
});
