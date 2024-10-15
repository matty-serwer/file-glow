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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
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

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((v) => v instanceof FileList, "Required")
    .refine((data) => data.length > 0, "Required"),
});


export default function Home() {
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    console.log(values.file);
    const postUrl = await generateUploadUrl();
    console.log(postUrl);

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file[0].type },
      body: values.file[0],
    });

    const { storageId } = await result.json();

    try {
      await createFile({
        name: values.title,
        fileId: storageId,
        organizationId: organizationId!,
      })

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

  const session = useSession();
  return (
    <main className="container mx-auto pt-12 font-[family-name:var(--font-geist-sans)]">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">
          Your Files
        </h1>
        <Dialog open={isFileDialogOpen} onOpenChange={(isOpen) => {
          setIsFileDialogOpen(isOpen);
          form.reset();
        }}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                if (!organizationId) return;

              }}
            >
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-6">File Upload</DialogTitle>
              <DialogDescription>
                {/* FORM */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Input type="file" {...fileRef} />
                          </FormControl>
                        </FormItem>
                      }
                    />
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="flex items-center gap-1"
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


      </div>

      {files?.map((file) => (
        <div key={file._id}>{file.name}</div>
      ))}


    </main>
  );
}
