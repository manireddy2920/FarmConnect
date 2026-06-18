import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

function generateHash(): string {
  return '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const organic = searchParams.get('organic');
    const farmer_id = searchParams.get('farmer');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'freshness';
    const limit = Math.min(Number(searchParams.get('limit') || 50), 100);

    const filter: any = { status: 'active', quantity_kg: { $gt: 0 } };
    if (category && category !== 'all') filter.category = category;
    if (organic === 'true') filter.organic = true;
    if (farmer_id) filter.farmer_id = farmer_id;
    if (search) filter.crop_name = { $regex: search, $options: 'i' };

    const sortMap: Record<string, any> = {
      freshness: { harvest_date: -1 },
      price_asc: { price_per_kg: 1 },
      price_desc: { price_per_kg: -1 },
      newest: { createdAt: -1 },
    };
    const sortObj = sortMap[sort] || sortMap.freshness;

    const products = await Product.find(filter)
      .populate('farmer_id', 'name avatar')
      .sort(sortObj)
      .limit(limit);

    return NextResponse.json({ products }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'farmer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const product = await Product.create({
      ...body,
      farmer_id: (session.user as any).id,
      original_quantity: body.quantity_kg,
      blockchain_hash: generateHash(),
      status: 'active',
      carbon_saved_per_kg: 0.21,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 500 });
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

    const product = await Product.findOneAndUpdate(
      { _id: id, farmer_id: (session.user as any).id },
      body,
      { new: true }
    );

    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    await Product.findOneAndUpdate(
      { _id: id, farmer_id: (session.user as any).id },
      { status: 'sold' }
    );

    return NextResponse.json({ message: 'Product removed' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
