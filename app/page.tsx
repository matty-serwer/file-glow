"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useOrganization,
  useSession,
  useUser,
} from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  let organizationId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    organizationId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(
    api.files.getFiles,
    organizationId ? { organizationId } : "skip"
  );
  const createFile = useMutation(api.files.createFile);

  const session = useSession();
  return (
    <main className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">

      {files?.map((file) => (
        <div key={file._id}>{file.name}</div>
      ))}

      <Button
        onClick={() => {
          if (!organizationId) return;
          createFile({
            name: "testtt",
            organizationId,
          });
        }}
      >
        Click Me
      </Button>
    </main>
  );
}
