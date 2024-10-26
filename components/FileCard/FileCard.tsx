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

import { Doc } from "../../convex/_generated/dataModel"
import { Button } from "../ui/button";
import { TrashIcon, MoreVerticalIcon } from "lucide-react";
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

function getFileUrl(file: Doc<"files">) {
  return `${process.env.NEXT_PUBLIC_STORAGE_URL}/api/files/${file.fileId}`;
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
      <CardContent>
        {file.type === "image" && <Image
          src={file.url}
          alt={file.name}
          width={200}
          height={100} />
        }
      </CardContent>
      <CardFooter>
        <Button data-testid="download-button">Download</Button>
      </CardFooter>
    </Card>
  );
}
