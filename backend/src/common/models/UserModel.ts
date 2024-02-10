import mongoose, { Schema } from 'mongoose';

export interface UserInterface {
  name: string;
  email: string;
  avatar?: string;
}

export const UserSchema = new Schema<UserInterface>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String,
});

export const User = mongoose.model<UserInterface>('User', UserSchema);
