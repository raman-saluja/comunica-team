import mongoose, { Schema } from 'mongoose';
import m2s from 'mongoose-to-swagger';

import { defaultToJSONMethod } from '@common/utils/db';

export interface WorkspaceInterface {
  _id: Schema.Types.ObjectId;
  name: string;
  description?: string;
  created_by: Schema.Types.ObjectId;
}

export const WorkspaceSchema = new Schema<WorkspaceInterface>({
  name: { type: String, required: true },
  description: { type: String, required: false },
  created_by: { type: Schema.ObjectId, ref: 'User', required: true },
});

WorkspaceSchema.set('toJSON', defaultToJSONMethod());

export const Workspace = mongoose.model<WorkspaceInterface>('Workspace', WorkspaceSchema);
export const swaggerSchema = m2s(Workspace);
