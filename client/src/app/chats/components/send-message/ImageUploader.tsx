import { api, APIResponse } from "@/api/api";
import { useState, useRef } from "react";

type UploadStatus = "success" | "error" | null;

interface UseImageUploaderOptions {
  endpoint?: string;
  onSuccess?: (
    response: APIResponse<{
      originalName: string;
      filename: string;
      mimetype: string;
      size: number;
      url: string;
      uploadedAt: Date;
    }>
  ) => void;
  onError?: (error: Error) => void;
  autoReset?: boolean;
  resetDelay?: number;
}

interface UseImageUploaderReturn {
  // Data
  selectedFile: File | null;
  previewUrl: string | null;
  isUploading: boolean;
  uploadStatus: UploadStatus;

  // Functions
  selectFile: () => void;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  confirmUpload: () => Promise<void>;
  cancelSelection: () => void;
  reset: () => void;

  // Ref for file input
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export default function useImageUploader(
  options: UseImageUploaderOptions = {}
): UseImageUploaderReturn {
  const {
    endpoint = "/api/upload",
    onSuccess,
    onError,
    autoReset = false,
    resetDelay = 2000,
  } = options;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectFile = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setUploadStatus(null);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      throw new Error("Please select a valid image file");
    }
  };

  const confirmUpload = async (): Promise<void> => {
    if (!selectedFile) {
      throw new Error("No file selected");
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await api.post<
        APIResponse<{
          originalName: string;
          filename: string;
          mimetype: string;
          size: number;
          url: string;
          uploadedAt: Date;
        }>
      >(endpoint, formData);

      if (response.status === 200) {
        setUploadStatus("success");
        onSuccess?.(response.data);

        if (autoReset) {
          setTimeout(() => {
            reset();
          }, resetDelay);
        }
      } else {
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      const uploadError =
        error instanceof Error ? error : new Error("Upload failed");
      setUploadStatus("error");
      onError?.(uploadError);
      throw uploadError;
    } finally {
      setIsUploading(false);
    }
  };

  const cancelSelection = (): void => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const reset = (): void => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadStatus(null);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    // Data
    selectedFile,
    previewUrl,
    isUploading,
    uploadStatus,

    // Functions
    selectFile,
    handleFileSelect,
    confirmUpload,
    cancelSelection,
    reset,

    // Ref
    fileInputRef,
  };
}
