import { Socket, io } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./SocketInterface";

export const URL = import.meta.env.VITE_SOCKET_SERVER;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  URL,
  {
    autoConnect: false
  }
);
