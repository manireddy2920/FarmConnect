import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import FarmerProfile from '@/models/FarmerProfile';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectDB();

    // Create admin
    let admin = await User.findOne({ email: 'admin@farmconnect.in' });
    if (!admin) {
      admin = await User.create({
        name: 'FarmConnect Admin',
        email: 'admin@farmconnect.in',
        password: 'admin123',
        role: 'admin',
        phone: '9876543210',
        referral_code: 'FCADMIN',
      });
    }

    // Create farmers
    const farmersData = [
      { name: 'Ravi Kumar', email: 'ravi@farm.in', district: 'Warangal', state: 'Telangana', bio: 'Organic farmer for 15 years', story: 'Started with 2 acres, now 12 acres of certified organic land. Three generations of farming.' },
      { name: 'Lakshmi Devi', email: 'lakshmi@farm.in', district: 'Krishna', state: 'Andhra Pradesh', bio: 'Specialises in leafy greens', story: 'Pioneered hydroponic farming in our village. Supplying fresh greens to Hyderabad for 5 years.' },
      { name: 'Suresh Yadav', email: 'suresh@farm.in', district: 'Medak', state: 'Telangana', bio: 'Traditional grain farmer', story: 'Grows heritage varieties of rice and millets. Winner of state agriculture award 2022.' },
    ];

    const farmerUsers = [];
    for (const fd of farmersData) {
      let u = await User.findOne({ email: fd.email });
      if (!u) {
        u = await User.create({
          name: fd.name, email: fd.email, password: 'farmer123',
          role: 'farmer', phone: '9' + Math.floor(Math.random() * 1000000000),
          referral_code: 'FC' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        });
      }
      let fp = await FarmerProfile.findOne({ user_id: u._id });
      if (!fp) {
        fp = await FarmerProfile.create({
          user_id: u._id, district: fd.district, state: fd.state,
          farming_type: 'organic', bio: fd.bio, story: fd.story,
          verified: true, verification_date: new Date(), years_of_farming: 10,
        });
      }
      farmerUsers.push(u);
    }

    // Create consumer
    let consumer = await User.findOne({ email: 'priya@consumer.in' });
    if (!consumer) {
      consumer = await User.create({
        name: 'Priya Sharma', email: 'priya@consumer.in', password: 'consumer123',
        role: 'consumer', token_balance: 150,
        referral_code: 'FC' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      });
    }

    // Create products
    const productsData = [
      { crop_name: 'Tomatoes', variety: 'Cherry Tomato', category: 'vegetables', quantity_kg: 50, price_per_kg: 45, harvest_date: new Date(Date.now() - 2 * 86400000), organic: true, photos: ['https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400'], district: 'Warangal', state: 'Telangana' },
      { crop_name: 'Spinach', variety: 'Baby Spinach', category: 'vegetables', quantity_kg: 30, price_per_kg: 35, harvest_date: new Date(Date.now() - 1 * 86400000), organic: true, photos: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400'], district: 'Krishna', state: 'Andhra Pradesh' },
      { crop_name: 'Mango', variety: 'Alphonso', category: 'fruits', quantity_kg: 100, price_per_kg: 120, harvest_date: new Date(Date.now() - 3 * 86400000), organic: false, photos: ['https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=400'], district: 'Krishna', state: 'Andhra Pradesh' },
      { crop_name: 'Rice', variety: 'Sona Masuri', category: 'grains', quantity_kg: 200, price_per_kg: 55, harvest_date: new Date(Date.now() - 5 * 86400000), organic: false, photos: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'], district: 'Medak', state: 'Telangana' },
      { crop_name: 'Brinjal', variety: 'Long Purple', category: 'vegetables', quantity_kg: 40, price_per_kg: 28, harvest_date: new Date(Date.now() - 1 * 86400000), organic: true, photos: ['https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400'], district: 'Krishna', state: 'Andhra Pradesh' },
      { crop_name: 'Banana', variety: 'Robusta', category: 'fruits', quantity_kg: 80, price_per_kg: 32, harvest_date: new Date(Date.now() - 2 * 86400000), organic: false, photos: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'], district: 'Medak', state: 'Telangana' },
    ];

    for (let i = 0; i < productsData.length; i++) {
      const pd = productsData[i];
      const farmer = farmerUsers[i % farmerUsers.length];
      const existing = await Product.findOne({ crop_name: pd.crop_name, farmer_id: farmer._id });
      if (!existing) {
        await Product.create({
          ...pd, farmer_id: farmer._id,
          original_quantity: pd.quantity_kg, status: 'active',
          blockchain_hash: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          carbon_saved_per_kg: 0.21,
        });
      }
    }

    return NextResponse.json({
      message: 'Seeded successfully',
      accounts: {
        admin: { email: 'admin@farmconnect.in', password: 'admin123' },
        farmer: { email: 'ravi@farm.in', password: 'farmer123' },
        consumer: { email: 'priya@consumer.in', password: 'consumer123' },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
