import React, { useState, useCallback } from "react";
import { uploadImage } from "@/api/upload";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ImageUp, UploadCloud } from "lucide-react";

export default function UploadImage({ onUploadSuccess, setUploading }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // ✅ Xử lý chọn file thủ công
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // ✅ Kéo thả file
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      setPreview(URL.createObjectURL(dropped));
    }
  }, []);

  // ✅ Upload lên server
  const handleUpload = async () => {
    if (!file) {
      toast.error("⚠️ Vui lòng chọn hoặc kéo thả ảnh!");
      return;
    }

    try {
      if (setUploading) setUploading(true);
      const res = await uploadImage(file);
      onUploadSuccess && onUploadSuccess(res.url);
      toast.success("🚀 Ảnh đã tải lên thành công!");
    } catch (err) {
      toast.error("❌ Upload thất bại, thử lại sau!");
      console.error(err);
    } finally {
      if (setUploading) setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-4"
    >
      {/* Khu vực kéo–thả */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`w-full border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer 
          ${
            dragActive
              ? "border-blue-500 bg-blue-50 scale-[1.01]"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
          }`}
      >
        <input
          type="file"
          accept="image/*"
          id="fileUpload"
          className="hidden"
          onChange={handleFileChange}
        />

        {!preview ? (
          <label
            htmlFor="fileUpload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <UploadCloud
              size={48}
              className="text-blue-500 mb-2 transition-transform group-hover:scale-110"
            />
            <p className="text-gray-700 font-medium">
              Kéo & thả ảnh vào đây hoặc <span className="text-blue-600 underline">chọn file</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">Hỗ trợ: JPG, PNG, WEBP</p>
          </label>
        ) : (
          <div className="flex flex-col items-center">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-56 object-cover rounded-lg shadow-sm border border-gray-200"
            />
            <Button
              onClick={() => setPreview(null)}
              variant="outline"
              className="mt-3 text-sm text-gray-600 hover:text-red-600"
            >
              🗑️ Chọn ảnh khác
            </Button>
          </div>
        )}
      </div>

      {/* Nút Upload */}
      {preview && (
        <Button
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 w-full"
        >
          <ImageUp size={18} className="mr-2" />
          Tải ảnh lên
        </Button>
      )}
    </motion.div>
  );
}
