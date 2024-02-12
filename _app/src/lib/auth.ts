import { UserInterface } from "@/types/User";
import * as jose from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const AUTH_TOKEN = "auth_token";

export const decodeJWT = async (token: string) => {
  "use server";
  try {
    const jwtSecret = new TextEncoder().encode(process.env.APP_SECRET);
    let decoded = await jose.jwtVerify(token, jwtSecret);
    return decoded;
  } catch (e) {
    return false;
  }
};

export const isAuthenticated = async (request: NextRequest) => {
  const cookies = request.cookies;

  if (!cookies.has(AUTH_TOKEN)) return false;
  const res = await decodeJWT(cookies.get(AUTH_TOKEN)?.value!);

  return res ? true : false;
};

export interface AuthInterface {
  status: boolean;
  user?: UserInterface;
}

export const auth = async (): Promise<AuthInterface> => {
  const _cookies = cookies();

  if (!_cookies.has(AUTH_TOKEN)) return { status: false };
  const res = await decodeJWT(_cookies.get(AUTH_TOKEN)?.value!);

  if (!res) return { status: false };
  return { status: true, user: res.payload.user as UserInterface };
};

export const login = async (token: UserInterface["token"]) => {
  "use server";
  cookies().set(AUTH_TOKEN, token);
};
