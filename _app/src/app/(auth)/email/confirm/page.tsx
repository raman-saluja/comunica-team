"use client";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";

// Function to obfuscate email
const obfuscateEmail = (email: string) => {
  const [username, domain] = email.split("@");
  const obfuscatedUsername = username.substring(0, 3) + "..."; // You can customize the obfuscation as needed
  return obfuscatedUsername + "@" + domain;
};

export default function Page() {
  const email = "test@gmail.com";
  const handleResendEmail = () => null;
  return (
    <>
      <div className="container relative h-[800px] flex-col items-center justify-center  grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="absolute md:hidden left-4 top-5 z-20 flex items-center text-sm font-medium">
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

        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Communica Inc.
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Anyone at Tesla can and should email/talk to anyone else
                according to what they think is the fastest way to solve a
                problem for the benefit of the whole company.&rdquo;
              </p>
              <footer className="text-sm">Elon Musk</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-4 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Confirmation
              </h1>
              <p className="text-sm text-muted-foreground">
                An email has been sent to your email address
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Please check your inbox to complete the signup process.
              </p>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                className={cn(buttonVariants({ variant: "outline" }))}
                onClick={handleResendEmail}
              >
                Resend Email
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
