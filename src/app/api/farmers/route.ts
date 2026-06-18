import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import FarmerProfile from '@/models/FarmerProfile';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const verified = searchParams.get('verified');

    const profiles = await FarmerProfile.find(
      verified !== null ? { verified: verified === 'true' } : {}
    ).populate('user_id', 'name email phone created_at');

    return NextResponse.json(profiles);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch farmers' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const body = await req.json();
    const { action } = body;

    if (action === 'approve') {
      await FarmerProfile.findByIdAndUpdate(id, { verified: true, verification_date: new Date() });
      return NextResponse.json({ message: 'Farmer approved' });
    } else if (action === 'reject') {
      await FarmerProfile.findByIdAndDelete(id);
      return NextResponse.json({ message: 'Farmer rejected' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update farmer' }, { status: 500 });
  }
}
