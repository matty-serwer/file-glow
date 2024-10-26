import { Doc } from "@/convex/_generated/dataModel";

export const fileTypes: Record<string, Doc<"files">["type"]> = {
  "image/jpeg": "image",
  "image/gif": "image",
  "image/png": "image",
  "application/pdf": "pdf",
  "audio/wav": "video",
  "audio/mpeg": "video",
  "audio/aiff": "video",
  "text/plain": "document",
  "video/mp4": "video",
  "text/csv": "csv",
};

export const getFileType = (mimeType: string): Doc<"files">["type"] => {
  return fileTypes[mimeType] || "document";
};
