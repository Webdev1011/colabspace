export type Role = "admin" | "student" | "guest";

export interface User {
  uid: string;
  email: string;
  name: string;
  role: string;
  online: string;
}

export interface ChatMessage {
  id?: string;
  chatId: string;
  senderId: string;
  text?: string;
  mediaUrl?: string;
  type: "text" | "file" | "video";
  timestamp: Date;
}

export interface CallSignal {
  caller: string;
  callee: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  callerCandidates: RTCIceCandidateInit[];
  calleeCandidates: RTCIceCandidateInit[];
}
