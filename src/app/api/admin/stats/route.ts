import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';

// Public lightweight stats for the homepage StatsSection
export async function GET() {
  try {
    await connectDB();

    const [totalFarmers, totalConsumers, totalOrders] = await Promise.all([
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'consumer' }),
      Order.countDocuments(),
    ]);

    return NextResponse.json({ totalFarmers, totalConsumers, totalOrders });
  } catch {
    return NextResponse.json({ totalFarmers: 0, totalConsumers: 0, totalOrders: 0 });
  }
}
