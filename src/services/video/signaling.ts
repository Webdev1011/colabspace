import { services } from "@/firebase/firebaseConfig";
import { doc, onSnapshot, setDoc, updateDoc, getDoc } from "firebase/firestore";

export const sendSignal = async (roomId: string, data: any) => {
  const { db } = services;
  await setDoc(doc(db, "signals", roomId), data);
};

export const listenToSignal = (
  roomId: string,
  callback: (data: any) => void
) => {
  const { db } = services;
  const unsub = onSnapshot(doc(db, "signals", roomId), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    }
  });
  return unsub;
};
