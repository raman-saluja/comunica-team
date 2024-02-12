"use client";
import { redirect, useRouter } from "next/navigation";
import { create } from "./actions";
import { useEffect, useState } from "react";

export default function Page(request: any) {
  const { push } = useRouter();
  const [loading, setLoading] = useState(true);
  const [verify, setVerify] = useState(false);

  const verifyToken = async () => {
    const token = request.searchParams?.token;
    const verify = token ? await create(token) : false;

    if (verify) {
      localStorage.setItem("authToken", verify);
      push("/dashboard");
      setVerify(true);
      setLoading(false);
    } else {
      setVerify(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <>
      {loading ? (
        "Please wait..."
      ) : (
        <div>
          {verify ? (
            <div>Email Verified. Redirecting....</div>
          ) : (
            <div>Verification Failed !</div>
          )}
        </div>
      )}
    </>
  );
}
