import mongoose, { Schema } from 'mongoose';
import m2s from 'mongoose-to-swagger';

import { defaultToJSONMethod } from '@common/utils/db';

export interface WorkspaceInterface {
  _id: Schema.Types.ObjectId;
  name: string;
  description?: string;
}

export const WorkspaceSchema = new Schema<WorkspaceInterface>({
  name: { type: String, required: true },
  description: { type: String, required: false },
});

WorkspaceSchema.set('toJSON', defaultToJSONMethod());

export const Workspace = mongoose.model<WorkspaceInterface>('Workspace', WorkspaceSchema);
export const swaggerSchema = m2s(Workspace);
