import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket";
import { io, Socket } from "socket.io-client";

export const socketIO = () => {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
    io("localhost:8080");

  // client-side
  socket.on("connect", () => {
    console.log(socket.id);
  });

  socket.on("disconnect", () => {
    console.log(socket.id); // undefined
  });

  return socket;
};
