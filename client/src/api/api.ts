import { AUTH_TOKEN, logout } from "@/app/auth/AuthSlice";
import { store } from "@/redux/store";
import axios, { HttpStatusCode } from "axios";

export type APIResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
  statusCode: HttpStatusCode;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

api.interceptors.request.use((request) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  if (token)
    request.headers.Authorization = `Bearer ${localStorage.getItem(
      AUTH_TOKEN
    )}`;
  return request;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response.status == 401) {
      store.dispatch(logout());
    }
    return error;
  }
);
