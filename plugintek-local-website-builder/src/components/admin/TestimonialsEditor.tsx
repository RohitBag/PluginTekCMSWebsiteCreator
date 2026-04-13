'use client'

import React, { useState } from 'react';
import { useSite } from '@/store/SiteContext';
import { Testimonial } from '@/types/cms';
import { Plus, Trash2, CheckCircle2, XCircle, Star } from 'lucide-react';

export default function TestimonialsEditor() {
  const { config, updateConfig } = useSite();
  const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({
    name: '',
    role: '',
    content: '',
    rating: 5,
    is_enabled: true
  });

  const addTestimonial = () => {
    if (!newTestimonial.name || !newTestimonial.content) return;
    
    const testimonial: Testimonial = {
      ...(newTestimonial as Testimonial),
      id: Date.now().toString()
    };

    updateConfig(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, testimonial]
    }));

    setNewTestimonial({
      name: '',
      role: '',
      content: '',
      rating: 5,
      is_enabled: true
    });
  };

  const removeTestimonial = (id: string) => {
    updateConfig(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter(t => t.id !== id)
    }));
  };

  const toggleEnabled = (id: string) => {
    updateConfig(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(t => 
        t.id === id ? { ...t, is_enabled: !t.is_enabled } : t
      )
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Add New Testimonial</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Client Name"
              value={newTestimonial.name}
              onChange={e => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
            />
            <input
              type="text"
              placeholder="Role (e.g. CEO, Founder)"
              value={newTestimonial.role}
              onChange={e => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
            />
          </div>
          <textarea
            placeholder="Review Content"
            value={newTestimonial.content}
            onChange={e => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm h-24"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setNewTestimonial({ ...newTestimonial, rating: star })}
                    className={newTestimonial.rating! >= star ? "text-amber-500" : "text-gray-300"}
                  >
                    <Star size={16} fill={newTestimonial.rating! >= star ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={addTestimonial}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
            >
              <Plus size={16} />
              Add Testimonial
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {config.testimonials.map(t => (
          <div key={t.id} className={`p-4 rounded-xl border ${t.is_enabled ? 'bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800' : 'bg-gray-50 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800/50 opacity-60'}`}>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
                  <span className="text-xs text-gray-500">{t.role}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic line-clamp-2">"{t.content}"</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleEnabled(t.id)}
                  className={`p-2 rounded-lg transition-colors ${t.is_enabled ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  {t.is_enabled ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                </button>
                <button
                  onClick={() => removeTestimonial(t.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
