import mongoose, { Schema } from 'mongoose';
import m2s from 'mongoose-to-swagger';

import { WorkspaceInterface } from '@modules/workspaces/WorkspaceModel';

export interface ChannelInterface {
  _id: Schema.Types.ObjectId;
  name: string;
  workspace: WorkspaceInterface;
  description?: string;
}

export const ChannelSchema = new Schema<ChannelInterface>({
  name: { type: String, required: true },
  description: { type: String, required: false },
  workspace: { type: Schema.ObjectId, ref: 'Workspace' },
});

export const Channel = mongoose.model<ChannelInterface>('Channel', ChannelSchema);
export const swaggerSchema = m2s(Channel);
