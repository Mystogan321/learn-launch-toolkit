
import React, { ChangeEvent, useRef, useState } from "react";
import { Upload, X } from "lucide-react";

interface FileUploadProps {
  label: string;
  accept?: string;
  maxSize?: number; // in MB
  onChange: (file: File | null) => void;
  value?: File | string | null;
  helperText?: string;
  error?: string;
}

export function FileUpload({
  label,
  accept = "image/*",
  maxSize = 5, // 5MB default
  onChange,
  value,
  helperText,
  error,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    typeof value === "string" ? value : null
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (!file) {
      onChange(null);
      setPreview(null);
      return;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size exceeds ${maxSize}MB limit`);
      return;
    }
    
    // Update the parent component
    onChange(file);
    
    // Create preview URL for images
    if (file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    } else {
      setPreview(null);
    }
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange(null);
    setPreview(null);
  };

  return (
    <div className="space-y-2">
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-card/30 transition-colors ${
          error ? "border-destructive" : "border-border"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />
        
        {value ? (
          <div className="space-y-2">
            {preview ? (
              <div className="flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-40 max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="text-sm text-white font-medium">
                {typeof value === "string" 
                  ? value.split("/").pop() 
                  : value.name}
              </div>
            )}
            
            <div className="flex justify-center">
              <button
                type="button"
                className="text-sm text-destructive hover:text-destructive/80 flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
              >
                <X size={16} />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-center">
              <Upload className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="text-sm font-medium text-white">{label}</div>
            {helperText && (
              <p className="text-xs text-muted-foreground">{helperText}</p>
            )}
          </div>
        )}
      </div>
      
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
