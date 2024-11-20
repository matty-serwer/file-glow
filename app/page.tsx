"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/files");
  }, [router]);

  return null; // Or return a loading state/landing page if desired
}
