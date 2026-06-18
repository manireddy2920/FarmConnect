import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'farmer' | 'consumer' | 'admin';
  phone?: string;
  language: string;
  token_balance: number;
  referral_code: string;
  avatar?: string;
  created_at: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['farmer', 'consumer', 'admin'], default: 'consumer' },
  phone: { type: String },
  language: { type: String, default: 'en' },
  token_balance: { type: Number, default: 0 },
  referral_code: { type: String, unique: true },
  avatar: { type: String },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
