import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const role = (session.user as any).role;
    const userId = (session.user as any).id;

    const filter = role === 'farmer' ? { farmer_id: userId } :
                   role === 'admin'  ? {} :
                   { consumer_id: userId };

    const orders = await Order.find(filter)
      .populate('product_id', 'crop_name photos blockchain_hash')
      .populate('consumer_id', 'name email')
      .populate('farmer_id', 'name')
      .sort({ created_at: -1 });

    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const { product_id, quantity, payment_method, delivery_address, delivery_slot } = body;

    const product = await Product.findById(product_id);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    if (product.quantity_kg < quantity) return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });

    const total_amount = product.price_per_kg * quantity;

    const order = await Order.create({
      consumer_id: (session.user as any).id,
      farmer_id: product.farmer_id,
      product_id,
      quantity,
      total_amount,
      payment_method,
      delivery_address,
      delivery_slot,
      escrow_status: 'held',
      order_status: 'placed',
      transaction_hash: '0xTXN' + Math.random().toString(16).slice(2, 18),
    });

    // Decrement stock
    await Product.findByIdAndUpdate(product_id, { $inc: { quantity_kg: -quantity } });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to place order' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const body = await req.json();

    const order = await Order.findByIdAndUpdate(id, body, { new: true });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    return NextResponse.json({ order });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
