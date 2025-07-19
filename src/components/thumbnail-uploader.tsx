"use client";

import { useState, useCallback, type DragEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud } from "lucide-react";

interface ThumbnailUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

export function ThumbnailUploader({ onFilesSelected }: ThumbnailUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      onFilesSelected(Array.from(files));
    }
  };

  const handleDrag = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setIsDragging(true);
    } else if (event.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      if(imageFiles.length !== files.length) {
         toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload only image files.",
        });
      }
      if (imageFiles.length > 0) {
        onFilesSelected(imageFiles);
      }
    }
  }, [onFilesSelected, toast]);

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-10 md:p-20 border-2 border-dashed rounded-xl transition-all duration-300
        ${isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/50 bg-card hover:border-primary hover:bg-primary/5"}`}
    >
      <input
        type="file"
        id="file-upload"
        multiple
        accept="image/png, image/jpeg, image/webp"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload" className="flex flex-col items-center justify-center text-center cursor-pointer">
        <UploadCloud className={`w-16 h-16 mb-4 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
        <h3 className="text-xl font-semibold">Drag & drop your thumbnails here</h3>
        <p className="text-muted-foreground mt-2">or click to browse files</p>
        <p className="text-sm text-muted-foreground/80 mt-4">(Please upload at least 2 images)</p>
      </label>
    </div>
  );
}
