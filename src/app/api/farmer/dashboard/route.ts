import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'farmer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const farmerId = (session.user as any).id;

    const [totalProducts, activeProducts, totalOrders, pendingOrders, earningsAgg, recentOrders] =
      await Promise.all([
        Product.countDocuments({ farmer_id: farmerId }),
        Product.countDocuments({ farmer_id: farmerId, status: 'active' }),
        Order.countDocuments({ farmer_id: farmerId }),
        Order.countDocuments({ farmer_id: farmerId, order_status: { $in: ['placed', 'confirmed', 'packed'] } }),
        Order.aggregate([
          { $match: { farmer_id: farmerId, payment_status: 'paid' } },
          { $group: { _id: null, total: { $sum: '$total_amount' } } },
        ]),
        Order.find({ farmer_id: farmerId })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('product_id', 'crop_name photos')
          .populate('consumer_id', 'name'),
      ]);

    const totalEarnings = earningsAgg[0]?.total || 0;

    return NextResponse.json({
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      totalEarnings,
      recentOrders,
      farmer: session.user,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to load dashboard' }, { status: 500 });
  }
}
