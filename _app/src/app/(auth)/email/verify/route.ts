import { type NextRequest } from "next/server";
import { create } from "./actions";
import { redirect } from "next/navigation";
import { APIResponse, api } from "@/axios/api";
import { cookies } from "next/headers";

export interface VerifyAPIResponse extends APIResponse {
  data: { token: string };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  const res = await api<VerifyAPIResponse>({
    url: "auth/verify",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).catch(() => console.error("failed"));
  if (res?.data.success) {
    if (res.data.data.token) {
      cookies().set("auth_token", res.data.data.token);
    }
    redirect("/dashboard");
  }
  return new Response("Verification Failed");
}
