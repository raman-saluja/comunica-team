import { buttonVariants } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmailFailedConfirm() {
  const handleResendEmail = () => null;
  return (
    <>
      <div className="container relative h-screen overflow-hidden flex-col items-center justify-center  grid lg:max-w-none lg:grid-cols-1 lg:px-0">
        <div className="absolute left-4 top-5 z-20 flex items-center text-sm font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Communica Inc.
        </div>

        <div className="mx-auto flex w-full flex-col justify-cente items-center space-y-6">
          <div className="flex flex-col space-y-4 text-center">
            <div className="flex items-center justify-center mb-2 text-red-600">
              <XCircle size={50} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Email Verification Failed
            </h1>
          </div>

          <div className="flex gap-2 justify-center">
            <button
              type="button"
              className={cn(buttonVariants({ variant: "default" }))}
              onClick={handleResendEmail}
            >
              Resend Email
            </button>
            <Link
              to={"/login"}
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
