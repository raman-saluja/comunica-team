import { ChannelInterface } from "../channels/ChannelInterface";
import { UserInterface } from "../users/UserInterface";

export interface ChatMessageInterface {
  id: string;
  channel: ChannelInterface;
  message: string;
  sender: UserInterface;
  created_at: string;
}


