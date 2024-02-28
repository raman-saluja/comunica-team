import { getAuthTokenFromStorage } from "@/lib/auth";
import { ClientToServerEvents, ServerToClientEvents } from "./SocketInterface";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
export const URL = import.meta.env.VITE_SOCKET_SERVER;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  URL,
  {
    autoConnect: false
  }
);
