import axios, { HttpStatusCode } from "axios";

export type APIResponse<T = {}> = {
  success: boolean;
  message: string;
  data: T;
  statusCode: HttpStatusCode;
};

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER}`,
});

api.interceptors.request.use((request) => {
  return request;
});
