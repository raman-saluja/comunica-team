import { APIResponse } from "@/axios/api";
import { auth } from "@/lib/auth";
import { type NextRequest } from "next/server";

export interface VerifyAPIResponse extends APIResponse {
  data: { token: string };
}

export async function GET(request: NextRequest) {
  const res = await auth();
  return Response.json(res);
}
