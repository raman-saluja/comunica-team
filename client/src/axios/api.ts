import { AUTH_TOKEN } from "@/app/auth/AuthSlice";
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
  request.headers.Authorization = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
  return request;
});
