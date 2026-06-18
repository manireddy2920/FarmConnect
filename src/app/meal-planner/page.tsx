'use client';

import { useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { useCartStore } from '@/store';
import { Loader2, ShoppingCart, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const VEG_PLANS: Record<number, any[]> = {
  2: [
    { day: 'Monday',    breakfast: 'Poha with peas', lunch: 'Dal rice + palak sabzi', dinner: 'Roti + baingan bharta', ingredients: ['Poha 0.2kg', 'Peas 0.1kg', 'Spinach 0.3kg', 'Brinjal 0.4kg'] },
    { day: 'Tuesday',   breakfast: 'Upma with veggies', lunch: 'Sambar rice + beans', dinner: 'Roti + aloo sabzi', ingredients: ['Mixed veg 0.3kg', 'French beans 0.2kg', 'Potato 0.4kg'] },
    { day: 'Wednesday', breakfast: 'Idli + tomato chutney', lunch: 'Pulao + raita', dinner: 'Roti + dal makhani', ingredients: ['Tomatoes 0.3kg', 'Onion 0.2kg'] },
    { day: 'Thursday',  breakfast: 'Paratha + curd', lunch: 'Chole bhature', dinner: 'Khichdi + pickle', ingredients: ['Onion 0.2kg', 'Tomatoes 0.2kg'] },
    { day: 'Friday',    breakfast: 'Dosa + coconut chutney', lunch: 'Fried rice + paneer', dinner: 'Roti + mix veg curry', ingredients: ['Mixed veg 0.5kg', 'Tomatoes 0.2kg'] },
    { day: 'Saturday',  breakfast: 'Aloo paratha + yogurt', lunch: 'Rajma chawal', dinner: 'Pulao + raita', ingredients: ['Potato 0.3kg', 'Onion 0.2kg', 'Tomatoes 0.2kg'] },
    { day: 'Sunday',    breakfast: 'Puri + aloo sabzi', lunch: 'Biryani + salad', dinner: 'Soup + bread', ingredients: ['Potato 0.4kg', 'Mixed veg 0.4kg', 'Tomatoes 0.3kg'] },
  ],
  4: [
    { day: 'Monday',    breakfast: 'Poha with peas & onion', lunch: 'Dal rice + palak paneer', dinner: 'Roti + baingan bharta + salad', ingredients: ['Poha 0.4kg', 'Peas 0.2kg', 'Spinach 0.5kg', 'Brinjal 0.6kg', 'Onion 0.3kg'] },
    { day: 'Tuesday',   breakfast: 'Idli sambhar', lunch: 'Curd rice + papad', dinner: 'Roti + aloo gobi + dal', ingredients: ['Potato 0.5kg', 'Cauliflower 0.4kg', 'Tomatoes 0.3kg'] },
    { day: 'Wednesday', breakfast: 'Upma + juice', lunch: 'Sambar rice + beans curry', dinner: 'Chapati + paneer butter masala', ingredients: ['Mixed veg 0.5kg', 'Tomatoes 0.4kg', 'Onion 0.4kg'] },
    { day: 'Thursday',  breakfast: 'Dosa + chutney', lunch: 'Pulao + boondi raita', dinner: 'Roti + dal + salad', ingredients: ['Onion 0.3kg', 'Tomatoes 0.3kg', 'Mixed veg 0.3kg'] },
    { day: 'Friday',    breakfast: 'Paratha + pickle', lunch: 'Rajma chawal + salad', dinner: 'Fried rice + manchurian', ingredients: ['Potato 0.4kg', 'Onion 0.3kg', 'Cabbage 0.3kg', 'Carrots 0.2kg'] },
    { day: 'Saturday',  breakfast: 'Puri bhaji', lunch: 'Biryani + raita', dinner: 'Khichdi + papad', ingredients: ['Potato 0.5kg', 'Onion 0.4kg', 'Tomatoes 0.3kg', 'Mixed veg 0.3kg'] },
    { day: 'Sunday',    breakfast: 'Aloo stuffed dosa', lunch: 'Chole + bhature', dinner: 'Soup + garlic bread + salad', ingredients: ['Potato 0.3kg', 'Onion 0.4kg', 'Tomatoes 0.5kg', 'Spinach 0.3kg'] },
  ],
  6: [
    { day: 'Monday',    breakfast: 'Poha for 6 + chai', lunch: 'Dal makhani + rice + salad', dinner: 'Roti + palak paneer + aloo sabzi', ingredients: ['Poha 0.6kg', 'Spinach 0.8kg', 'Potato 0.5kg', 'Onion 0.5kg', 'Tomatoes 0.5kg'] },
    { day: 'Tuesday',   breakfast: 'Idli sambhar + filter coffee', lunch: 'Curd rice + mango pickle', dinner: 'Paratha + dal + achar', ingredients: ['Tomatoes 0.5kg', 'Onion 0.4kg', 'Mixed veg 0.5kg'] },
    { day: 'Wednesday', breakfast: 'Upma + fruit', lunch: 'Biryani + raita + papad', dinner: 'Roti + mix veg + salad', ingredients: ['Mixed veg 0.8kg', 'Tomatoes 0.5kg', 'Onion 0.5kg', 'Brinjal 0.4kg'] },
    { day: 'Thursday',  breakfast: 'Dosa + 2 chutneys', lunch: 'Sambar rice + beans fry', dinner: 'Chapati + paneer kadai', ingredients: ['Tomatoes 0.6kg', 'Onion 0.5kg', 'Capsicum 0.3kg'] },
    { day: 'Friday',    breakfast: 'Puri + aloo bhaji', lunch: 'Rajma chawal + salad', dinner: 'Fried rice + gobi manchurian', ingredients: ['Potato 0.6kg', 'Onion 0.5kg', 'Cauliflower 0.6kg', 'Tomatoes 0.4kg'] },
    { day: 'Saturday',  breakfast: 'Stuffed paratha + yogurt', lunch: 'Pulao + dal fry + papad', dinner: 'Roti + kadai veg + pickle', ingredients: ['Potato 0.5kg', 'Mixed veg 0.8kg', 'Onion 0.5kg', 'Tomatoes 0.5kg'] },
    { day: 'Sunday',    breakfast: 'Poori bhaji + halwa', lunch: 'Special biryani + raita', dinner: 'Soup + naan + paneer tikka', ingredients: ['Potato 0.6kg', 'Onion 0.6kg', 'Tomatoes 0.5kg', 'Mixed veg 0.5kg', 'Spinach 0.4kg'] },
  ],
};

const cartIngredients = [
  { product_id: 'prod1', crop_name: 'Tomatoes', farmer_name: 'Ravi Kumar', price_per_kg: 35, quantity: 2, photo: 'https://images.unsplash.com/photo-1546470427-227c0a5e3e97?w=400', organic: true, farmer_id: 'farmer1' },
  { product_id: 'prod3', crop_name: 'Spinach', farmer_name: 'Suresh Reddy', price_per_kg: 28, quantity: 1, photo: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', organic: false, farmer_id: 'farmer3' },
  { product_id: 'prod6', crop_name: 'Onion', farmer_name: 'Suresh Reddy', price_per_kg: 22, quantity: 2, photo: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400', organic: false, farmer_id: 'farmer3' },
  { product_id: 'prod4', crop_name: 'Brinjal', farmer_name: 'Ravi Kumar', price_per_kg: 25, quantity: 1, photo: 'https://images.unsplash.com/photo-1659904604064-9d5e6f93ad05?w=400', organic: true, farmer_id: 'farmer1' },
];

export default function MealPlannerPage() {
  const [familySize, setFamilySize] = useState<2 | 4 | 6>(4);
  const [preference, setPreference] = useState<'vegetarian' | 'vegan' | 'non-veg'>('vegetarian');
  const [plan, setPlan] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const { addItem } = useCartStore();

  const generate = async () => {
    setLoading(true);
    setPlan(null);
    setCartAdded(false);
    await new Promise(r => setTimeout(r, 1800));
    setPlan(VEG_PLANS[familySize]);
    setLoading(false);
    toast.success('7-day meal plan ready! 🍽️');
  };

  const addAllToCart = () => {
    cartIngredients.forEach(item => addItem(item));
    setCartAdded(true);
    toast.success('All ingredients added to cart! 🛒');
  };

  return (
    <div className="min-h-screen dark:bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="section-title">🍽️ AI Meal Planner</h1>
          <p className="text-gray-500 text-lg mt-2">Get a personalized 7-day meal plan and auto-fill your cart with farm-fresh ingredients</p>
        </div>

        {/* Config card */}
        <div className="card p-6 mb-8">
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Family Size</label>
              <div className="flex gap-3">
                {([2, 4, 6] as const).map(n => (
                  <button key={n} onClick={() => setFamilySize(n)}
                    className={`flex-1 py-3 rounded-xl border-2 font-bold text-lg transition-all ${familySize === n ? 'border-green-600 bg-green-50 dark:bg-green-900/30 text-green-700' : 'border-gray-200 dark:border-gray-700 hover:border-green-300'}`}>
                    {n} 👥
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Food Preference</label>
              <div className="flex gap-2">
                {(['vegetarian', 'vegan', 'non-veg'] as const).map(p => (
                  <button key={p} onClick={() => setPreference(p)}
                    className={`flex-1 py-3 px-2 rounded-xl border-2 text-xs font-semibold capitalize transition-all ${preference === p ? 'border-green-600 bg-green-50 dark:bg-green-900/30 text-green-700' : 'border-gray-200 dark:border-gray-700 hover:border-green-300'}`}>
                    {p === 'vegetarian' ? '🥦' : p === 'vegan' ? '🌱' : '🍗'}<br />{p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button onClick={generate} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4">
            {loading ? <><Loader2 size={20} className="animate-spin" /> Generating your plan...</> : <><RefreshCw size={18} /> Generate 7-Day Meal Plan</>}
          </button>
        </div>

        {/* Loading shimmer */}
        {loading && (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="skeleton h-24 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {/* Generated plan */}
        {plan && !loading && (
          <>
            {/* Add to cart banner */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-lg">🛒 Auto-fill your cart</p>
                <p className="text-green-100 text-sm">Add all required ingredients sourced from nearby verified farmers</p>
              </div>
              {cartAdded ? (
                <span className="bg-white text-green-700 font-bold px-5 py-3 rounded-xl">✅ Added to Cart!</span>
              ) : (
                <button onClick={addAllToCart} className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-5 py-3 rounded-xl flex items-center gap-2 transition-all">
                  <ShoppingCart size={18} /> Add All Ingredients
                </button>
              )}
            </div>

            {/* Weekly plan */}
            <div className="space-y-4">
              {plan.map((day, i) => (
                <div key={i} className="card p-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0 bg-green-700 text-white rounded-xl px-4 py-3 text-center min-w-[90px]">
                      <p className="font-bold text-sm">{day.day}</p>
                      <p className="text-green-200 text-xs">Day {i+1}</p>
                    </div>
                    <div className="flex-1 grid sm:grid-cols-3 gap-3 text-sm">
                      {[
                        { label: '☀️ Breakfast', meal: day.breakfast },
                        { label: '🌤️ Lunch', meal: day.lunch },
                        { label: '🌙 Dinner', meal: day.dinner },
                      ].map(({ label, meal }) => (
                        <div key={label} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3">
                          <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
                          <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">{meal}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {day.ingredients.map((ing: string, j: number) => (
                      <span key={j} className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-700">
                        🥬 {ing}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Note */}
            <p className="text-center text-gray-400 text-sm mt-6">
              🌿 All ingredients sourced from verified farmers within 50km · Freshness guaranteed
            </p>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
