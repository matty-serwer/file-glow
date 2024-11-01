import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Doc, Id } from "../../convex/_generated/dataModel"
import { Button } from "../ui/button";
import { TrashIcon, MoreVerticalIcon, GanttChartIcon, FileTextIcon, VideoIcon, ImageIcon } from "lucide-react";
import { typeIcons } from "@/utils/typeIcons"

import { ReactNode, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
/**
 * FileCardActions component: Renders the actions menu for a file card
 * @param {Object} props - Component props
 * @param {Doc<"files">} props.file - The file object
 * @returns {JSX.Element} Rendered FileCardActions component
 */
function FileCardActions({ file }: { file: Doc<"files"> }) {
  console.log(file);
  const deleteFile = useMutation(api.files.deleteFile);
  const toast = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your file
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="delete-cancel-button">Cancel</AlertDialogCancel>
            <AlertDialogAction
              data-testid="delete-confirm-button"
              onClick={async () => {
                await deleteFile({
                  fileId: file._id
                });
                toast.toast({
                  variant: "success",
                  title: "File deleted",
                  description: "File deleted successfully.",
                });
                setIsConfirmOpen(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger data-testid="file-actions-trigger">
          <MoreVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => setIsConfirmOpen(true)}
            className="flex gap-1 text-red-600 items-center cursor-pointer"
            data-testid="delete-file-button"
          >
            <TrashIcon className="w-4 h-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

// function getFileUrl(fileId: Id<"_storage">) {
//   // console.log(fileId);
//   // return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;

//   // return api.storage.getUrl(fileId);
// }

function getFileUrl({ file }: { file: Doc<"files"> }) {
  console.log(file);
  return file.url
}
/**
 * FileCard component: Renders a card displaying file information
 * @param {Object} props - Component props
 * @param {Doc<"files">} props.file - The file object to display
 * @returns {JSX.Element} Rendered FileCard component
 */

export default function FileCard({ file }: { file: Doc<"files"> }) {
  return (
    <Card data-testid={`file-card-${file._id}`}>
      <CardHeader className="relative">
        <div className="flex items-center gap-2">
          {typeIcons[file.type]}
          <CardTitle data-testid="file-name" className="text-2xl font-semibold">{file.name}</CardTitle>
        </div>
        <div className="absolute top-3 right-3">
          <FileCardActions file={file} />
        </div>
      </CardHeader>
      <CardContent className="h-[120px] flex justify-center items-center">
        {/* TODO: When getFileUrl is returning a link to the file image this should work */}
        {file.type === "image" && (
          <Image
            src={getFileUrl({ file })}
            alt={file.name}
            width={80}
            height={80} />
        )}

        {file.type === "csv" && <GanttChartIcon className="w-20 h-20" />}
        {file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
        {file.type === "video" && <VideoIcon className="w-20 h-20" />}
        {file.type === "document" && <FileTextIcon className="w-20 h-20" />}

      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          data-testid="download-button"
          onClick={async () => {
            const url = await getFileUrl({ file });
            console.log(url);
            window.open(url, '_blank');
            // TODO: Does this work on all browsers?
          }}
        >
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
