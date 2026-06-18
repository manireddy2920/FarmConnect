import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  order_id: mongoose.Types.ObjectId;
  consumer_id: mongoose.Types.ObjectId;
  farmer_id: mongoose.Types.ObjectId;
  product_id: mongoose.Types.ObjectId;
  freshness_rating: number;
  taste_rating: number;
  packaging_rating: number;
  text?: string;
  blockchain_hash: string;
  created_at: Date;
}

const ReviewSchema = new Schema<IReview>({
  order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  consumer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  farmer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  freshness_rating: { type: Number, min: 1, max: 5 },
  taste_rating: { type: Number, min: 1, max: 5 },
  packaging_rating: { type: Number, min: 1, max: 5 },
  text: String,
  blockchain_hash: { type: String, unique: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
