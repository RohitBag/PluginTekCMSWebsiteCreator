'use client'

import React from 'react';
import { useSite } from '@/store/SiteContext';
import { ArrowUp, ArrowDown, Eye, EyeOff, Gp } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

export default function LayoutEditor() {
  const { config, updateConfig, currentPageId } = useSite();

  const activePage = config.pages.find(p => p.id === currentPageId) || config.pages[0];
  const layout = activePage.layout;

  const handleReorder = (newOrder: any[]) => {
    updateConfig(prev => ({
      ...prev,
      pages: prev.pages.map(p => 
        p.id === currentPageId ? { ...p, layout: newOrder } : p
      )
    }));
  };

  const toggleSection = (id: string) => {
    updateConfig(prev => ({
      ...prev,
      pages: prev.pages.map(p => 
        p.id === currentPageId 
          ? { ...p, layout: p.layout.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s) } 
          : p
      )
    }));
  };

  return (
    <div className="space-y-4">
      <Reorder.Group 
        axis="y" 
        values={layout} 
        onReorder={handleReorder}
        className="space-y-2"
      >
        {layout.map((section) => (
          <Reorder.Item 
            key={section.id} 
            value={section}
            className={`flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-border rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors ${!section.enabled ? 'opacity-50 grayscale' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="text-secondary text-[10px] grid grid-cols-2 gap-0.5 opacity-50">
                {[...Array(6)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-current rounded-full" />)}
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight">{section.label}</h4>
                <p className="text-[10px] text-secondary font-mono uppercase">{section.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); toggleSection(section.id); }}
                className={`p-2 rounded-lg transition-colors ${section.enabled ? 'text-primary hover:bg-primary/10' : 'text-secondary hover:bg-accent'}`}
              >
                {section.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl">
        <p className="text-xs text-secondary leading-relaxed">
          <span className="font-bold text-primary mr-1">Pro Tip:</span> 
          Rearrange sections for the <b>{activePage.title}</b> page. You can customize the layout uniquely for each page.
        </p>
      </div>
    </div>
  );
}
