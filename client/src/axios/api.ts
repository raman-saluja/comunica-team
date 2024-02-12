import axios, { HttpStatusCode } from "axios";

export type APIResponse<T = {}> = {
  success: boolean;
  message: string;
  data: T;
  statusCode: HttpStatusCode;
};

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}`,
});

api.interceptors.request.use((request) => {
  return request;
});
