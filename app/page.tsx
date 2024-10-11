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
} from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";

export default function Home() {
  const { organization } = useOrganization();
  const files = useQuery(
    api.files.getFiles,
    organization?.id ? { organizationId: organization.id } : "skip"
  );
  const createFile = useMutation(api.files.createFile);

  const session = useSession();
  return (
    <main className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* User is signed in */}
      <SignedIn>
        <div>You are signed in</div>
        <SignOutButton>
          <Button>Sign out</Button>
        </SignOutButton>
      </SignedIn>
      {/* User is NOT signed in */}
      <SignedOut>
        <SignInButton mode="modal">
          <Button>Sign in</Button>
        </SignInButton>
      </SignedOut>

      {files?.map((file) => (
        <div key={file._id}>{file.name}</div>
      ))}

      <Button onClick={() => {
        if (!organization?.id) return;
        createFile({
          name: "testtt",
          organizationId: organization.id,
        });
      }}>
        Click Me
      </Button>
    </main>
  );
}
