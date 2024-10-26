"use client";

import { api } from "@/convex/_generated/api";
import {
  useOrganization,
  useUser,
} from "@clerk/nextjs";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import UploadButton from "@/components/UploadButton/UploadButton";
import FileCard from "@/components/FileCard/FileCard";
export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  let organizationId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    organizationId = organization.organization?.id ?? user.user?.id;
  }

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  const files = useQuery(
    api.files.getFiles,
    organizationId ? { organizationId } : "skip"
  );
  const createFile = useMutation(api.files.createFile);

  return (
    <main className="container mx-auto pt-12 font-[family-name:var(--font-geist-sans)]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          Your Files
        </h1>
        <UploadButton />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {files?.map((file) => {
          return <FileCard key={file._id} file={file} />;
        })}
      </div>
    </main>
  );
}
