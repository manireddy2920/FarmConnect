import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const userId = (session.user as any).id;

    const order = await Order.findOneAndUpdate(
      { _id: params.id, consumer_id: userId },
      { order_status: 'delivered', escrow_status: 'released' },
      { new: true }
    );

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to confirm delivery' }, { status: 500 });
  }
}
