import { fireStore } from "../config/firebase";
import { ResponseType, UserDataType } from "../types/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadeFileToCloudinary } from "./imageServices";

export const updateUser = async (
  uid: string,
  updatedData: UserDataType
): Promise<ResponseType> => {
  try {
    if (updatedData.image && updatedData?.image?.uri) {
      const imageUploadRes = await uploadeFileToCloudinary(
        updatedData?.image,
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

    const userRef = doc(fireStore, "users", uid);
    await updateDoc(userRef, updatedData);
    return { success: true };
  } catch (error: any) {
    console.log("error updateing the user", error);
    return { success: false, msg: error.message };
  }
};
