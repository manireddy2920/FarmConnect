'use client';

import { useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { mockEvents } from '@/lib/mockData';
import { Calendar, MapPin, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ICONS: Record<string, string> = {
  farmer_market: '🛒',
  festival: '🎉',
  workshop: '📚',
  fair: '🌿',
};

export default function EventsPage() {
  const [events, setEvents] = useState(mockEvents);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', location: '', description: '', category: 'farmer_market' });
  const [registered, setRegistered] = useState<Set<string>>(new Set());

  const register = (id: string) => {
    const s = new Set(registered);
    if (s.has(id)) { s.delete(id); toast.success('Registration cancelled'); }
    else { s.add(id); toast.success('Registered! See you there 🎉'); }
    setRegistered(s);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setEvents([{ _id: `ev${Date.now()}`, ...form, organizer: 'You' }, ...events]);
    setShowForm(false);
    setForm({ title: '', date: '', location: '', description: '', category: 'farmer_market' });
    toast.success('Event posted!');
  };

  return (
    <div className="min-h-screen dark:bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title mb-1">Local Events</h1>
            <p className="text-gray-500">Farmer markets, organic fairs, and harvest festivals near you</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Post Event
          </button>
        </div>

        <div className="space-y-4">
          {events.map(event => (
            <div key={event._id} className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Date box */}
                <div className="flex-shrink-0 bg-green-700 text-white rounded-xl p-4 text-center w-20">
                  <p className="text-2xl font-bold">{format(new Date(event.date), 'dd')}</p>
                  <p className="text-green-200 text-xs">{format(new Date(event.date), 'MMM')}</p>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{ICONS[event.category] || '📅'}</span>
                        <h2 className="font-bold text-gray-900 dark:text-white text-lg">{event.title}</h2>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                        <MapPin size={13} /> {event.location}
                        <Calendar size={13} className="ml-2" /> {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{event.description}</p>
                      <p className="text-xs text-gray-400 mt-2">Posted by {event.organizer}</p>
                    </div>
                    <button
                      onClick={() => register(event._id)}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${registered.has(event._id) ? 'bg-green-100 text-green-700 border border-green-300' : 'btn-primary py-2'}`}
                    >
                      {registered.has(event._id) ? '✅ Registered' : 'Register'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Post event modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-lg w-full">
              <div className="flex justify-between mb-4">
                <h2 className="font-bold text-lg">Post New Event</h2>
                <button onClick={() => setShowForm(false)}><X size={20} /></button>
              </div>
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Event Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input-field" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Date *</label>
                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="input-field" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field">
                      {[['farmer_market', 'Farmer Market'], ['festival', 'Festival'], ['workshop', 'Workshop'], ['fair', 'Organic Fair']].map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Location *</label>
                  <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="input-field" placeholder="District, State" required />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Description *</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field resize-none" rows={3} required />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 dark:border-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">Post Event</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
