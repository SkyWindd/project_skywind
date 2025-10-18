/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { uploadImage } from "../api/upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
const UploadImage = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) {
      alert("⚠️ Vui lòng chọn ảnh trước khi tải lên!");
      return;
    }
    try {
      setUploading(true);
      const res = await uploadImage(file);
      setUploadedUrl(res.url);
      if (onUploadSuccess) onUploadSuccess(res.url);
    } catch (err) {
      alert("❌ Upload thất bại!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center gap-6 p-6"
    >
      <h2 className="text-2xl font-semibold text-blue-600">📤 Upload Ảnh</h2>

      <Card className="w-full max-w-md shadow-lg rounded-2xl border border-gray-200">
        <CardContent className="p-6 flex flex-col items-center">
          <label
            htmlFor="file"
            className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-xl transition-all"
          >
            Chọn ảnh từ máy
          </label>
          <input
            id="file"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {preview && (
            <motion.img
              src={preview}
              alt="Preview"
              className="mt-4 rounded-2xl shadow-md w-64 object-cover"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
          )}

          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 w-40"
          >
            {uploading ? "⏳ Đang tải..." : "🚀 Tải ảnh lên"}
          </Button>

          {uploadedUrl && (
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-green-600 font-medium mb-2">✅ Ảnh đã upload:</p>
              <img
                src={uploadedUrl}
                alt="Uploaded"
                className="rounded-2xl shadow-md w-64 object-cover mx-auto"
              />
              <p className="text-sm text-gray-500 mt-2 break-all">{uploadedUrl}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UploadImage;
