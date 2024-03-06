import mongoose, { Schema } from 'mongoose';
import m2s from 'mongoose-to-swagger';

import { defaultToJSONMethod } from '@common/utils/db';
import { UserInterface } from '@modules/user/UserModel';
import { WorkspaceInterface } from '@modules/workspaces/WorkspaceModel';

export enum Roles {
  Owner = 'owner',
  Member = 'member',
}

export interface WorkspaceUsersInterface {
  _id: Schema.Types.ObjectId;
  user: UserInterface;
  workspace: WorkspaceInterface;
  role: Roles;
  date_joined: Schema.Types.Date;
}

export const WorkspaceUserSchema = new Schema<WorkspaceUsersInterface>({
  workspace: { type: Schema.ObjectId, ref: 'Workspace' },
  user: { type: Schema.ObjectId, ref: 'User' },
  role: { type: String, default: Roles.Owner, enum: Object.values(Roles) },
  date_joined: { type: Date, default: Date.now },
});

WorkspaceUserSchema.set('toJSON', defaultToJSONMethod());

export const WorkspaceUsers = mongoose.model<WorkspaceUsersInterface>(
  'WorkspaceUsers',
  WorkspaceUserSchema,
  'workspace_users'
);
export const swaggerSchema = m2s(WorkspaceUsers);
