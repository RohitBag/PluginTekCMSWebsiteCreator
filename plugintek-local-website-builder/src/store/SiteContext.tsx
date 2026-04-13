'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteConfig } from '@/types/cms';
import { DEFAULT_CONFIG } from '@/constants/defaultConfig';

interface SiteContextType {
  config: SiteConfig;
  updateConfig: (updater: (prev: SiteConfig) => SiteConfig) => void;
  resetConfig: () => void;
  currentPageId: string;
  setCurrentPageId: (id: string) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPageId, setCurrentPageId] = useState('home');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('plugintek_local_cms_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // --- Migration Logic ---
        // If 'layout' exists at the top level, move it to a default 'home' page
        let migratedPages = parsed.pages || DEFAULT_CONFIG.pages;
        if (parsed.layout && !parsed.pages) {
          migratedPages = [
            {
              id: 'home',
              title: 'Home',
              slug: '/',
              layout: parsed.layout
            }
          ];
        }

        // Robust merge with DEFAULT_CONFIG to ensure new schema fields exist at any depth
        setConfig({
          ...DEFAULT_CONFIG,
          ...parsed,
          metadata: { 
            ...DEFAULT_CONFIG.metadata, 
            ...(parsed.metadata || {}) 
          },
          pages: migratedPages,
          testimonials: parsed.testimonials || DEFAULT_CONFIG.testimonials,
          sections: { 
            ...DEFAULT_CONFIG.sections, 
            ...(parsed.sections || {}),
            hero: { ...DEFAULT_CONFIG.sections.hero, ...(parsed.sections?.hero || {}) },
            about: { ...DEFAULT_CONFIG.sections.about, ...(parsed.sections?.about || {}) },
            contact: { ...DEFAULT_CONFIG.sections.contact, ...(parsed.sections?.contact || {}) },
            testimonials: { ...DEFAULT_CONFIG.sections.testimonials, ...(parsed.sections?.testimonials || {}) },
          },
          content: { 
            ...DEFAULT_CONFIG.content, 
            ...(parsed.content || {}) 
          },
        });
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Persist to localStorage whenever config changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('plugintek_local_cms_state', JSON.stringify(config));
    }
  }, [config, isLoaded]);

  const updateConfig = useCallback((updater: (prev: SiteConfig) => SiteConfig) => {
    setConfig(prev => updater(prev));
  }, []);

  const resetConfig = useCallback(() => {
    if (confirm("Are you sure you want to reset everything? This will clear all local progress.")) {
      setConfig(DEFAULT_CONFIG);
      setCurrentPageId('home');
    }
  }, []);

  return (
    <SiteContext.Provider value={{ config, updateConfig, resetConfig, currentPageId, setCurrentPageId }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}
