import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import FarmerProfile from '@/models/FarmerProfile';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, phone, district, state, farming_type, languages } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const referral_code = Math.random().toString(36).substring(2, 10).toUpperCase();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      referral_code,
      token_balance: role === 'consumer' ? 100 : 0, // Welcome bonus for consumers
    });

    // Create farmer profile if registering as farmer
    if (role === 'farmer') {
      await FarmerProfile.create({
        user_id: user._id,
        district: district || '',
        state: state || '',
        farming_type: farming_type || 'conventional',
        languages_spoken: languages ? languages.split(',').map((l: string) => l.trim()) : [],
        verified: false,
      });
    }

    return NextResponse.json({ message: 'Registration successful', userId: user._id }, { status: 201 });
  } catch (err: any) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
