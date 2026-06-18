import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import FarmerProfile from '@/models/FarmerProfile';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectDB();

    const [totalOrders, totalUsers, pendingFarmers, totalRevenue] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      FarmerProfile.countDocuments({ verified: false }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total_amount' } } }]),
    ]);

    return NextResponse.json({
      stats: {
        totalOrders,
        totalUsers,
        pendingFarmers,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
