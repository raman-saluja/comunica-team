import { AUTH_TOKEN } from "@/app/auth/AuthSlice";
import EmailConfirmPage from "@/app/auth/email/EmailConfirmPage";
import EmailFailedConfirm from "@/app/auth/email/EmailFailedConfirm";
import LoginPage from "@/app/auth/login/LoginPage";
import RegisterPage from "@/app/auth/register/RegisterPage";
import DefaultLayout from "@/app/layout/DefaultLayout";
import { APIResponse, api } from "@/axios/api";
import NoMatch from "@/errors/NoMatch";
import React from "react";
import {
  LoaderFunction,
  LoaderFunctionArgs,
  RouteObject,
  redirect,
} from "react-router-dom";

const DashboadPage = React.lazy(() => import("@/app/dashboard/DashboardPage"));
const ViewWorkspacePage = React.lazy(
  () => import("@/app/workspaces/view/ViewWorkspacePage")
);

const loaderForAuthPages: LoaderFunction = () => {
  if (localStorage.getItem(AUTH_TOKEN)) {
    return redirect("/dashboard");
  }
  return {};
};

const loaderForProtected: LoaderFunction = () => {
  if (!localStorage.getItem(AUTH_TOKEN)) {
    return redirect("/login");
  }
  return {};
};

const AppRoutes: RouteObject[] = [
  {
    index: true,
    loader: loaderForAuthPages,
    Component: LoginPage,
  },
  {
    path: "login",
    loader: loaderForAuthPages,
    element: <LoginPage />,
  },
  {
    path: "register",
    loader: loaderForAuthPages,
    element: <RegisterPage />,
  },
  {
    path: "email/confirm",
    loader: loaderForAuthPages,
    element: <EmailConfirmPage />,
  },
  {
    path: "email/verify",
    loader: async ({ request }: LoaderFunctionArgs) => {
      const url = new URL(request.url);
      const token = url.searchParams.get("token");

      if (!token) {
        console.log("not a valid token");
        return redirect("/login");
      }

      const res = await api<APIResponse<{ token: string }>>({
        url: "auth/verify",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.data.data.token)
        .catch((e) => console.log(e));

      if (res) {
        localStorage.setItem(AUTH_TOKEN, res);
        return redirect("/dashboard");
      }

      return {};
    },
    element: <EmailFailedConfirm />,
  },
  {
    Component: DefaultLayout,
    loader: loaderForProtected,
    children: [
      {
        path: "dashboard",
        Component: DashboadPage,
      },
      {
        path: "workspaces/:id",
        Component: ViewWorkspacePage,
      },
    ],
  },
  {
    path: "*",
    Component: NoMatch,
  },
];

export default AppRoutes;