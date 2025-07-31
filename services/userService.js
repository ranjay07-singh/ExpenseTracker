import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/config/firebase";
import {
  getFilePath,
  getProfileImage,
  uploadFileToCloudinary,
} from "./imageService";

console.log("🔍 Available ImageService exports:", {
  uploadFileToCloudinary,
  getFilePath,
  getProfileImage,
});

/**
 * Updates a user's data in Firestore. If image is provided, uploads it to Cloudinary first.
 * @param {string} uid - User ID.
 * @param {object} updatedData - User data object (may include image).
 * @returns {Promise<{success: boolean, msg: string}>}
 */
export const updateUser = async (uid, updatedData) => {
  try {
    // Upload image to Cloudinary if provided
    if (updatedData.image && updatedData.image.uri) {
      const imageUploadRes = await uploadFileToCloudinary(
        updatedData.image,
        "users"
      );

      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload image",
        };
      }

      updatedData.image = imageUploadRes.data; 
    }

    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, updatedData);

    return {
      success: true,
      msg: "Updated successfully",
    };
  } catch (error) {
    console.log("Error updating user: ", error);
    return {
      success: false,
      msg: error?.message || "Update failed",
    };
  }
};
