import mongoose, { Schema, Document } from 'mongoose';

export interface IFarmerProfile extends Document {
  user_id: mongoose.Types.ObjectId;
  aadhaar_url?: string;
  farm_location_lat?: number;
  farm_location_lng?: number;
  district: string;
  state: string;
  farming_type: 'organic' | 'conventional' | 'mixed';
  bio?: string;
  story?: string;
  video_url?: string;
  verified: boolean;
  verification_date?: Date;
  certifications: Array<{ name: string; hash: string; issue_date: Date }>;
  languages_spoken: string[];
  years_of_farming?: number;
  family_background?: string;
  farming_philosophy?: string;
  total_earned: number;
  pending_payout: number;
}

const FarmerProfileSchema = new Schema<IFarmerProfile>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  aadhaar_url: String,
  farm_location_lat: Number,
  farm_location_lng: Number,
  district: { type: String, required: true },
  state: { type: String, required: true },
  farming_type: { type: String, enum: ['organic', 'conventional', 'mixed'], default: 'conventional' },
  bio: { type: String, maxlength: 200 },
  story: { type: String, maxlength: 500 },
  video_url: String,
  verified: { type: Boolean, default: false },
  verification_date: Date,
  certifications: [{ name: String, hash: String, issue_date: Date }],
  languages_spoken: [String],
  years_of_farming: Number,
  family_background: String,
  farming_philosophy: String,
  total_earned: { type: Number, default: 0 },
  pending_payout: { type: Number, default: 0 },
});

export default mongoose.models.FarmerProfile || mongoose.model<IFarmerProfile>('FarmerProfile', FarmerProfileSchema);
