import mongoose, { Schema } from 'mongoose';
import m2s from 'mongoose-to-swagger';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum UserVerifyStatus {
  YES = 1,
  NO = 0,
}

export interface UserInterface {
  _id: Schema.Types.ObjectId;
  id: Schema.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  status: UserStatus;
  verify: UserVerifyStatus;
}

export const UserSchema = new Schema<UserInterface>({
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  status: { type: String, required: false, default: UserStatus.ACTIVE },
  verify: { type: Number, required: false, default: UserVerifyStatus.NO },
});

UserSchema.set('toJSON', {
  transform: (_document, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.password;
    delete returnedObject.__v;
  },
});

export const User = mongoose.model<UserInterface>('User', UserSchema);
export const swaggerSchema = m2s(User);
