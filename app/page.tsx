"use client";

import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import UploadButton from "@/components/UploadButton/UploadButton";
import FileCard from "@/components/FileCard/FileCard";
import Image from "next/image";
import ScaleLoader from "react-spinners/ScaleLoader";
import SearchBar from "@/components/SearchBar/SearchBar";
import { Button } from "@/components/ui/button";
import { FilesIcon, StarIcon } from "lucide-react";
import Link from "next/link";
/**
 * Home component: Displays the main page with user's files or upload prompt
 * @returns {JSX.Element} The rendered Home component
 */
export default function Home() {
  // Get organization and user data from Clerk
  const organization = useOrganization();
  const user = useUser();

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // Determine the organization ID (or use user ID if no organization)
  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  // State for file dialog (not currently used, but kept for future implementation)
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  // Fetch files from the API
  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query: searchQuery } : "skip"
  );
  const isLoading = files === undefined;

  // Mutation for creating a new file (not used in this component, but available)
  const createFile = useMutation(api.files.createFile);

  return (
    <main className="container mx-auto pt-12 font-[family-name:var(--font-geist-sans)]" data-testid="home-page">

      <div className="flex">
        {/* Sidebar section */}
        <div id="sidebar" className="w-40 flex flex-col gap-2">
          <Link href="/dashboard/files">
            <Button variant="ghost" className="flex gap-2">
              <FilesIcon /> All Files
            </Button>
          </Link>

          <Link href="/dashboard/favorites">
            <Button variant="ghost" className="flex gap-2">
              <StarIcon /> Favorites
            </Button>
          </Link>
        </div>

        {/* Header section */}
        <div id="main" className="w-full">
          {/* <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold" data-testid="page-title">Your Files</h1>
            <SearchBar setQuery={setSearchQuery} query={searchQuery} />
            <UploadButton />
          </div> */}

          {/* <div className="mb-8" data-testid="search-bar">
        <SearchBar />
      </div> */}

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center h-[60vh]" data-testid="loading-spinner">
              <ScaleLoader color="#2196f3" height={100} width={32} />
            </div>
          )}

          {/* Files found */}
          {!isLoading && files && files.length > 0 && (
            <div className="grid grid-cols-4 gap-4" data-testid="file-grid">
              {files.map((file) => file.url && (
                <FileCard key={file._id} file={{ ...file, url: file.url }} />
              ))}
            </div>
          )}

          {/* No files found */}
          {!isLoading && !searchQuery && files && files.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[60vh]" data-testid="no-files-message">
              <Image
                src="/folder-image.png"
                alt="No files"
                width={300}
                height={300}
                className="mb-8"
                data-testid="no-files-image"
              />
              <p className="text-2xl font-semibold" data-testid="no-files-text">
                You have no files yet. Upload your first file to get started!
              </p>
            </div>
          )}

          {/* Empty search results */}
          {!isLoading && searchQuery && files && files.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[60vh]" data-testid="no-files-message">
              <Image
                src="/folder-image.png"
                alt="No files"
                width={300}
                height={300}
                className="mb-8"
                data-testid="no-files-image"
              />
              <p className="text-2xl font-semibold" data-testid="no-files-text">
                No files found.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
