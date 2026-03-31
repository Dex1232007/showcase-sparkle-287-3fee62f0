import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Loader2, ImageIcon, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface DragDropUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  className?: string;
  compact?: boolean;
  bucket?: string;
}

export default function DragDropUpload({
  onUpload,
  currentImage,
  className = "",
  compact = false,
  bucket = "product-images",
}: DragDropUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }

    setUploading(true);
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) {
      toast.error("Upload failed: " + error.message);
      setPreview(null);
    } else {
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      onUpload(data.publicUrl);
      toast.success("Image uploaded!");
    }
    setUploading(false);
  }, [bucket, onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }, [upload]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  };

  const displayImage = preview || currentImage;

  if (compact) {
    return (
      <div className={className}>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex items-center gap-3 p-3 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
            dragOver
              ? "border-accent bg-accent/10 scale-[1.01]"
              : "border-border hover:border-accent/50 hover:bg-muted/50"
          }`}
        >
          {displayImage ? (
            <img src={displayImage} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {uploading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                <span className="text-accent font-medium">Click</span> or drag image here
              </p>
            )}
          </div>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative group rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden ${
          dragOver
            ? "border-accent bg-accent/10 scale-[1.01] shadow-lg shadow-accent/10"
            : "border-border hover:border-accent/50 hover:bg-muted/30"
        }`}
      >
        <AnimatePresence mode="wait">
          {displayImage ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative aspect-video"
            >
              <img src={displayImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Replace image
                </motion.div>
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-10 px-4"
            >
              {uploading ? (
                <Loader2 className="w-10 h-10 animate-spin text-accent mb-3" />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-accent" />
                </div>
              )}
              <p className="text-sm font-medium mb-1">
                {uploading ? "Uploading..." : "Drop image here"}
              </p>
              <p className="text-xs text-muted-foreground">or click to browse • Max 5MB</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
    </div>
  );
}
