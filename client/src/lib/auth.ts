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
