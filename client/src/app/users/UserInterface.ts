export type UserInterface = {
  id: number;
  name: string;
  email: string;
  token: string;
  status: "active" | "inactive";
  verify: 0 | 1;
};
