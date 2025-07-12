import { onSnapshot, query, orderBy, collection } from "firebase/firestore";
import { services } from "../../firebase/firebaseConfig";

export const listenToMessages = (
  chatId: string,
  cb: (messages: any[]) => void
) => {
  const { db } = services;
  const q = query(
    collection(db, `chats/${chatId}/messages`),
    orderBy("timestamp", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    cb(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  });
};
