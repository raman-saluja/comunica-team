"use server";

import { APIResponse, api } from "@/axios/api";

// Server Action
export const create = async function (token: string) {
  const res = await api<APIResponse<{ token: string }>>({
    url: "auth/verify",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => res.data.data.token)
    .catch((e) => console.log(e));
  return res ? res : false;
};
