"use client";

import { Suspense } from "react";
import ForgotPassword from "@/modules/auth/forgot-password";

function Page() {
  return (
    <Suspense fallback={`Forgot Password Page`}>
      <ForgotPassword />
    </Suspense>
  );
}

export default Page;
