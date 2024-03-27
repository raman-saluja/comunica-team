import { ChannelInterface } from "@/app/channels/ChannelInterface";
import { ChatMessageInterface } from "@/app/chats/ChatModel";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  notification: (message: string) => void;
  "message-received": (message: ChatMessageInterface) => void;
  "joined-channel": (participant_id: string) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  "join-channel": (channel: string) => void;
  "leave-channel": (channel: string) => void;
  sendMessage: (data: SendMessageInterface) => boolean;
}

export interface SendMessageInterface {
  channel: ChannelInterface["id"];
  token: string;
  message: string;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
