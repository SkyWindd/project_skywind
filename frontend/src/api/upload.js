// src/api/upload.js
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:5000/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload thất bại");
  }

  return await response.json();
};
