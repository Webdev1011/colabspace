import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { services } from "../../firebase/firebaseConfig";

export const uploadFile = async (file: File, path: string) => {
  const { storage } = services;
  console.log("anvduiasvd", file, path);
  const storageRef = ref(storage, `${path}/${file.name}`);
  console.log("anvduiasvd1", storageRef);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};
