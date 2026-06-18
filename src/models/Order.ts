import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  consumer_id: mongoose.Types.ObjectId;
  farmer_id: mongoose.Types.ObjectId;
  product_id: mongoose.Types.ObjectId;
  quantity: number;
  total_amount: number;
  payment_method: 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';
  escrow_status: 'held' | 'released' | 'refunded';
  order_status: 'placed' | 'confirmed' | 'packed' | 'pickedup' | 'out_for_delivery' | 'delivered' | 'cancelled';
  delivery_address: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  delivery_slot: 'morning' | 'evening';
  transaction_hash?: string;
  created_at: Date;
  delivered_at?: Date;
}

const OrderSchema = new Schema<IOrder>({
  consumer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  farmer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  total_amount: { type: Number, required: true },
  payment_method: { type: String, enum: ['upi', 'card', 'netbanking', 'wallet', 'cod'], default: 'upi' },
  escrow_status: { type: String, enum: ['held', 'released', 'refunded'], default: 'held' },
  order_status: { type: String, enum: ['placed', 'confirmed', 'packed', 'pickedup', 'out_for_delivery', 'delivered', 'cancelled'], default: 'placed' },
  delivery_address: {
    line1: String,
    city: String,
    state: String,
    pincode: String,
  },
  delivery_slot: { type: String, enum: ['morning', 'evening'], default: 'morning' },
  transaction_hash: String,
  created_at: { type: Date, default: Date.now },
  delivered_at: Date,
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
