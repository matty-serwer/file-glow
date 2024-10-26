"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api";
import {
  useOrganization,
  useUser,
} from "@clerk/nextjs";

import { useMutation } from "convex/react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { Doc } from "@/convex/_generated/dataModel";
import { getFileType } from "@/utils/fileTypes";

// Form schema for file upload
const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((v) => v instanceof FileList, "Required")
    .refine((data) => data.length > 0, "Required"),
});

/**
 * UploadButton component: Renders a button to trigger file upload dialog
 * @returns {JSX.Element} Rendered UploadButton component
 */
export default function UploadButton() {
  const toast = useToast();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const organization = useOrganization();
  const user = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  });

  const fileRef = form.register("file");

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  const createFile = useMutation(api.files.createFile);

  let organizationId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    organizationId = organization.organization?.id ?? user.user?.id;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const fileType = values.file[0].type;
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": fileType },
        body: values.file[0],
      });

      const { storageId } = await result.json();

      const fileTypeForDb = getFileType(fileType);

      await createFile({
        name: values.title,
        fileId: storageId,
        organizationId: organizationId!,
        type: fileTypeForDb
      });

      form.reset();
      setIsFileDialogOpen(false);

      toast.toast({
        variant: "success",
        title: "File uploaded",
        description: "Your file is now viewable.",
      });
    } catch (error) {
      toast.toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "There was an error uploading your file.",
      });
    }
  };

  return (
    <Dialog open={isFileDialogOpen} onOpenChange={(isOpen) => {
      setIsFileDialogOpen(isOpen);
      form.reset();
    }}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            if (!organizationId) return;
          }}
          data-testid="upload-button"
        >
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-6">File Upload</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="file-title-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="file"
                  render={() =>
                    <FormItem>
                      <FormLabel>File</FormLabel>
                      <FormControl>
                        <Input type="file" {...fileRef} data-testid="file-input" />
                      </FormControl>
                    </FormItem>
                  }
                />
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="flex items-center gap-1"
                  data-testid="submit-upload-button"
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Submit
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
