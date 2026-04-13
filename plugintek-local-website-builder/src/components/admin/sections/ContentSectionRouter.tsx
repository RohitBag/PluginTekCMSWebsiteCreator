'use client'

import React, { useState } from 'react';
import HeroEditor from './HeroEditor';
import AboutEditor from './AboutEditor';
import ContactEditor from './ContactEditor';
import ServicesEditor from './ServicesEditor';
import ProjectsEditor from './ProjectsEditor';
import ItemsEditor from './ItemsEditor';
import TestimonialsEditor from '../TestimonialsEditor';
import CustomEditor from './CustomEditor';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTION_EDITORS = [
  { id: 'hero', label: 'Hero Section', component: HeroEditor },
  { id: 'about', label: 'About Section', component: AboutEditor },
  { id: 'services', label: 'Services List', component: ServicesEditor },
  { id: 'projects', label: 'Portfolio / Projects', component: ProjectsEditor },
  { id: 'items', label: 'Featured Items', component: ItemsEditor },
  { id: 'testimonials', label: 'Client Testimonials', component: TestimonialsEditor },
  { id: 'custom', label: 'Custom HTML Sections', component: CustomEditor },
  { id: 'contact', label: 'Contact Details', component: ContactEditor },
];

export default function ContentSectionRouter() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const activeEditor = SECTION_EDITORS.find(s => s.id === selectedSection);

  return (
    <div className="h-full">
      <AnimatePresence mode="wait">
        {!selectedSection ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-2"
          >
            {SECTION_EDITORS.map(section => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
              >
                <div>
                  <h3 className="font-bold text-sm tracking-tight">{section.label}</h3>
                  <p className="text-[10px] text-secondary font-mono uppercase">Configure section content</p>
                </div>
                <ChevronRight size={18} className="text-secondary group-hover:text-primary transition-colors" />
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <button 
              onClick={() => setSelectedSection(null)}
              className="flex items-center gap-2 text-primary text-sm font-bold hover:underline mb-4"
            >
              <ArrowLeft size={16} />
              Back to Sections
            </button>
            
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
               <h2 className="text-xl font-bold">{activeEditor?.label}</h2>
            </div>
            
            {activeEditor && <activeEditor.component />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
