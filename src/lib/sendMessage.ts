import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { services } from "../firebase/firebaseConfig";

type MessageType = "text" | "image" | "video" | "audio" | "file";

interface SendMessageParams {
  chatId: string;
  senderId: string;
  message: string;
  type?: MessageType;
  fileUrl?: string | null;
}

export const sendMessage = async ({
  chatId,
  senderId,
  message,
  type = "text",
  fileUrl = null,
}: SendMessageParams) => {
  const { db } = services;
  await addDoc(collection(db, `chats/${chatId}/messages`), {
    senderId,
    message,
    type,
    fileUrl,
    timestamp: serverTimestamp(),
  });
};
