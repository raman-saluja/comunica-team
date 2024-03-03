import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function avatarFallBackName(name: string) {
  return name.split(" ").map((v, i) => (i <= 1 ? v[0] : ""));
}

// export function env(key:string){
//   return import.meta.env.`${key}`;
// }
