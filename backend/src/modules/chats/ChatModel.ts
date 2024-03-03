import mongoose, { Schema } from 'mongoose';
import m2s from 'mongoose-to-swagger';

import { WorkspaceInterface } from '@modules/workspaces/WorkspaceModel';
import { ChannelInterface } from '@modules/channels/ChannelModel';
import { UserInterface } from '@modules/user/UserModel';
import { defaultToJSONMethod } from '@common/utils/db';

export interface ChatInterface {
  _id: Schema.Types.ObjectId;
  channel: ChannelInterface;
  message: string;
  sender: UserInterface;
  created_at: Schema.Types.Date;
}

export const ChatSchema = new Schema<ChatInterface>({
  message: { type: String, required: true },
  sender: { type: Schema.ObjectId, ref: 'User' },
  channel: { type: Schema.ObjectId, ref: 'Channel' },
  created_at: { type: Date, default: () => new Date() },
});

ChatSchema.set('toJSON', defaultToJSONMethod());

export const Chat = mongoose.model<ChatInterface>('Chat', ChatSchema);
export const swaggerSchema = m2s(Chat);
