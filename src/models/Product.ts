import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  farmer_id: mongoose.Types.ObjectId;
  crop_name: string;
  variety?: string;
  category: 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'herbs' | 'other';
  quantity_kg: number;
  original_quantity: number;
  price_per_kg: number;
  harvest_date: Date;
  available_until: Date;
  storage_method?: string;
  organic: boolean;
  certification_hash?: string;
  blockchain_hash: string;
  photos: string[];
  status: 'active' | 'sold' | 'donated' | 'expired';
  district: string;
  state: string;
  carbon_saved_per_kg: number;
  created_at: Date;
}

const ProductSchema = new Schema<IProduct>({
  farmer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  crop_name: { type: String, required: true },
  variety: String,
  category: { type: String, enum: ['vegetables', 'fruits', 'grains', 'dairy', 'herbs', 'other'], default: 'vegetables' },
  quantity_kg: { type: Number, required: true },
  original_quantity: { type: Number, required: true },
  price_per_kg: { type: Number, required: true },
  harvest_date: { type: Date, required: true },
  available_until: { type: Date, required: true },
  storage_method: String,
  organic: { type: Boolean, default: false },
  certification_hash: String,
  blockchain_hash: { type: String, unique: true },
  photos: [String],
  status: { type: String, enum: ['active', 'sold', 'donated', 'expired'], default: 'active' },
  district: String,
  state: String,
  carbon_saved_per_kg: { type: Number, default: 0.21 },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
