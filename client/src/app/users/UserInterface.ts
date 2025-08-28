export type UserInterface = {
  id: string;
  name: string;
  email: string;
  token: string;
  status: "active" | "inactive";
  verify: 0 | 1;
};
