import React, { useEffect, useState } from "react";
import { sendMessage } from "@/services/chat/sendMessage";
import { listenToMessages as listenMessages } from "@/services/chat/listenToMessages";
import { uploadFile } from "@/services/chat/uploadFile";
import { useAuth } from "@/contexts/AuthContext";

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [file, setFile] = useState(null);

  const chatId = "global"; // or generate dynamic chatId

  useEffect(() => {
    const unsubscribe = listenMessages(chatId, setMessages);
    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    let fileUrl = null;

    if (file) {
      fileUrl = await uploadFile(file, user.uid);
    }

    await sendMessage({
      chatId,
      senderId: user.uid,
      message: newMsg,
      type: file ? "file" : "text",
      fileUrl,
    });

    setNewMsg("");
    setFile(null);
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <b>{msg.senderId}</b>: {msg.message}
            {msg.fileUrl && (
              <div>
                <a href={msg.fileUrl} target="_blank" rel="noreferrer">
                  📎 Download
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Enter message"
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Chat;
