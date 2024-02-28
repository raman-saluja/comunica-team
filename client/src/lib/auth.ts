import { AUTH_TOKEN } from "@/app/auth/AuthSlice";
import { store } from "@/redux/store";
import * as jose from "jose";

export const decodeJWT = async (token: string) => {
  try {
    const jwtSecret = new TextEncoder().encode(process.env.APP_SECRET);
    const decoded = jose.jwtVerify(token, jwtSecret).then((res) => res.payload);
    return await decoded;
  } catch (e) {
    return false;
  }
};


export const getAuthTokenFromStorage = () => {
  return localStorage.getItem(AUTH_TOKEN);
}