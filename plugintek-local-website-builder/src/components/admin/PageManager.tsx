'use client'

import React, { useState } from 'react';
import { useSite } from '@/store/SiteContext';
import { PageConfig } from '@/types/cms';
import { Plus, Trash2, FileText, Layout, Settings2, ExternalLink } from 'lucide-react';

export default function PageManager() {
  const { config, updateConfig, currentPageId, setCurrentPageId } = useSite();
  const [showAdd, setShowAdd] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', slug: '' });

  const addPage = () => {
    if (!newPage.title || !newPage.slug) return;
    
    // Ensure slug starts with /
    let slug = newPage.slug;
    if (!slug.startsWith('/')) slug = '/' + slug;
    
    const id = slug.replace(/\//g, '') || 'home_alt';
    
    const page: PageConfig = {
      id,
      title: newPage.title,
      slug,
      layout: [
        { id: "hero", type: "fixed", label: "Hero Section", enabled: true },
        { id: "contact", type: "component", label: "Contact Section", enabled: true },
      ]
    };

    updateConfig(prev => ({
      ...prev,
      pages: [...prev.pages, page]
    }));

    setNewPage({ title: '', slug: '' });
    setShowAdd(false);
    setCurrentPageId(id);
  };

  const removePage = (id: string) => {
    if (id === 'home') return; // Cannot delete home
    if (confirm("Are you sure you want to delete this page?")) {
      updateConfig(prev => ({
        ...prev,
        pages: prev.pages.filter(p => p.id !== id)
      }));
      if (currentPageId === id) setCurrentPageId('home');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Site Pages</h3>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-primary transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {showAdd && (
        <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 space-y-3 animate-in fade-in slide-in-from-top-2">
          <input
            type="text"
            placeholder="Page Title (e.g. About Us)"
            value={newPage.title}
            onChange={e => setNewPage({ ...newPage, title: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
          />
          <input
            type="text"
            placeholder="Slug (e.g. /about)"
            value={newPage.slug}
            onChange={e => setNewPage({ ...newPage, slug: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={addPage}
              className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-bold"
            >
              Create Page
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="flex-1 bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 py-2 rounded-lg text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {config.pages.map(page => (
          <div 
            key={page.id}
            onClick={() => setCurrentPageId(page.id)}
            className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
              currentPageId === page.id 
                ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/20' 
                : 'bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 hover:border-primary/20 hover:bg-primary/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${currentPageId === page.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'}`}>
                <FileText size={16} />
              </div>
              <div>
                <h4 className={`text-sm font-bold ${currentPageId === page.id ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                  {page.title}
                </h4>
                <p className="text-[10px] text-gray-500 font-medium">{page.slug}</p>
              </div>
            </div>
            {page.id !== 'home' && (
              <button 
                onClick={(e) => { e.stopPropagation(); removePage(page.id); }}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
