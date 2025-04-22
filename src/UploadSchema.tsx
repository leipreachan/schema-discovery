"use client";

import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export function UploadSchema({ onUpload }: { onUpload: (arg: string | ArrayBuffer | null) => void }) {
  const [files, setFiles] = React.useState<File[]>([]);

  const reader = new FileReader();
  reader.addEventListener(
    "load",
    () => {
      if (onUpload) {
        onUpload(reader.result);
      }
    },
    false
  );

  const onFileValidate = React.useCallback(
    (file: File): string | null => {
      // Validate max files
      //   if (files.length >= 2) {
      //     return "You can only upload up to 2 files";
      //   }

      // Validate file type (only images)
      if (!file.type.startsWith("application/json")) {
        return "Only JSON files are allowed";
      }

      //   // Validate file size (max 2MB)
      //   const MAX_SIZE = 2 * 1024 * 1024; // 2MB
      //   if (file.size > MAX_SIZE) {
      //     return `File size must be less than ${MAX_SIZE / (1024 * 1024)}MB`;
      //   }

      if (file) {
        reader.readAsText(file);
      }
      return null;
    },
    [files]
  );

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <FileUpload
        value={files}
        onValueChange={setFiles}
        onFileValidate={onFileValidate}
        onFileReject={onFileReject}
        accept="application/json"
        maxFiles={1}
        className="w-full max-w-md"
        multiple
      >
        <FileUploadDropzone>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center rounded-full border p-2.5">
              <Upload className="size-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm">Drag & drop JSON Schema here</p>
            <p className="text-muted-foreground text-xs">Or click to browse</p>
          </div>
          <FileUploadTrigger asChild>
            <Button variant="outline" size="sm" className="mt-2 w-fit">
              Browse files
            </Button>
          </FileUploadTrigger>
        </FileUploadDropzone>
        <FileUploadList>
          {files.map((file) => (
            <FileUploadItem key={file.name} value={file}>
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              <FileUploadItemDelete asChild>
                <Button variant="ghost" size="icon" className="size-7">
                  <X />
                </Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
      </FileUpload>
    </div>
  );
}
