import { CLOUDNARY_CLOUD_NAME, CLOUDNARY_UPLOAD_PRESET } from "@/constants";
import axios from "axios";

const CLOUDNARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDNARY_CLOUD_NAME}/image/upload`;

export const uploadFileToCloudinary = async (file, folderName) => {
  try {
    if (typeof file === "string") {
      return { success: true, data: file };
    }

    if (file && file.uri) {
      const name = file.uri.split("/").pop();
      const extension = name.split(".").pop();

      const mimeMap = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png" };
      const mimeType = mimeMap[extension.toLowerCase()] || `image/${extension}`;

      const formData = new FormData();
      formData.append("file", { uri: file.uri, type: mimeType, name });
      formData.append("upload_preset", CLOUDNARY_UPLOAD_PRESET);
      if (folderName) formData.append("folder", folderName);

      const response = await axios.post(CLOUDNARY_API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload result:", response.data);

      return { success: true, data: response.data.secure_url };
    }

    return { success: false, msg: "No valid file provided" };
  } catch (error) {
    console.log("Upload error:", error.response?.data || error.message);
    return { success: false, msg: error.message || "Upload failed" };
  }
};

export const getFilePath = (file) => {
  if (typeof file === "string") return file;
  if (file && typeof file === "object") return file.uri;
  return require("../assets/images/EX3.png");
};

export const getProfileImage = getFilePath;
