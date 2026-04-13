'use client'

import React, { useState } from 'react';
import { useSite } from '@/store/SiteContext';
import { 
  Monitor, 
  Smartphone, 
  Download, 
  Upload, 
  Settings, 
  Layout, 
  FileText, 
  AlertCircle,
  Eye,
  RefreshCcw,
  Palette,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandingEditor from '@/components/admin/BrandingEditor';
import LayoutEditor from '@/components/admin/LayoutEditor';
import PageManager from '@/components/admin/PageManager';
import ContentSectionRouter from '@/components/admin/sections/ContentSectionRouter';
import { generateHTML } from '@/lib/generator';
import { exportToZip, importFromZip } from '@/lib/exporter';
import { useEffect, useRef } from 'react';

export default function CMSPage() {
  const { config, updateConfig, resetConfig, currentPageId } = useSite();
  const [activeTab, setActiveTab] = useState<'branding' | 'layout' | 'content'>('branding');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [htmlPreview, setHtmlPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real-time preview generation
  useEffect(() => {
    const html = generateHTML(config, currentPageId, previewTheme);
    setHtmlPreview(html);
  }, [config, currentPageId, previewTheme]);

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const importedConfig = await importFromZip(file);
        updateConfig(() => importedConfig);
        alert("Site restored successfully!");
      } catch (err) {
        alert("Error restoring site. Make sure it's a valid Plugintek ZIP.");
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden font-sans">
      {/* Warning Banner */}
      <div className="bg-amber-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium z-50 shadow-md">
        <AlertCircle size={16} />
        <span>Changes are not saved in the cloud. Use <b>Save locally</b> button to save your progress locally, and <b>Restore</b> button to restore your previous work.</span>
      </div>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Pane: Sidebar + Admin Forms */}
        <div className="w-[450px] border-r border-border flex flex-col bg-card z-20 shadow-xl">
          {/* Admin Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">P</div>
              <h1 className="font-bold text-lg tracking-tight">Plugintek <span className="text-primary">Lite</span></h1>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".zip" 
                onChange={handleRestore} 
              />
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="p-2 hover:bg-accent rounded-lg transition-colors"
                title="Restore from ZIP"
              >
                <Upload size={18} />
              </button>
              <button 
                onClick={() => exportToZip(config)} 
                className="flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                <Download size={16} />
                <span>Save locally</span>
              </button>
            </div>
          </div>

          {/* Admin Tabs */}
          <div className="flex border-b border-border p-1 bg-accent/30 gap-1 mx-4 my-4 rounded-xl">
            <button 
              onClick={() => setActiveTab('branding')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'branding' ? 'bg-white shadow-sm text-primary dark:bg-zinc-800' : 'text-secondary hover:text-foreground'}`}
            >
              <Palette size={16} />
              Branding
            </button>
            <button 
              onClick={() => setActiveTab('layout')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'layout' ? 'bg-white shadow-sm text-primary dark:bg-zinc-800' : 'text-secondary hover:text-foreground'}`}
            >
              <Layout size={16} />
              Layout
            </button>
            <button 
              onClick={() => setActiveTab('content')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'content' ? 'bg-white shadow-sm text-primary dark:bg-zinc-800' : 'text-secondary hover:text-foreground'}`}
            >
              <FileText size={16} />
              Content
            </button>
          </div>

          {/* Admin Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                 {activeTab === 'branding' && (
                   <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="space-y-4"
                   >
                     <h2 className="text-xl font-bold">Site Identity</h2>
                     <p className="text-sm text-secondary">Configure your site's core branding and visual style.</p>
                     <BrandingEditor />
                   </motion.div>
                 )}
                 {activeTab === 'layout' && (
                   <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                   >
                     <div className="space-y-4">
                       <h2 className="text-xl font-bold">Pages & Structure</h2>
                       <p className="text-sm text-secondary">Manage site pages and rearrange sections for the active page.</p>
                       <PageManager />
                     </div>
                     
                     <div className="pt-6 border-t border-border">
                       <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Section Layout</h3>
                       <LayoutEditor />
                     </div>
                   </motion.div>
                 )}
                 {activeTab === 'content' && (
                   <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                   >
                     <p className="text-sm text-secondary">Manage site-wide content for individual sections and collections.</p>
                     <ContentSectionRouter />
                   </motion.div>
                 )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Admin Footer */}
          <div className="p-4 border-t border-border flex items-center justify-between text-xs text-secondary bg-accent/10">
            <span>Plugintek local website builder v1.0</span>
            <button onClick={resetConfig} className="hover:text-red-500 font-medium flex items-center gap-1">
              <RefreshCcw size={12} />
              Reset All
            </button>
          </div>
        </div>

        {/* Right Pane: Live Preview */}
        <div className="flex-1 bg-accent/20 flex flex-col items-center justify-center p-8 relative overflow-hidden">
          {/* Device Toggle */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center bg-card rounded-full p-1 shadow-lg z-10 border border-border gap-1">
             <div className="flex border-r border-border pr-1 mr-1">
               <button 
                onClick={() => setPreviewMode('desktop')}
                className={`p-2 rounded-full transition-colors ${previewMode === 'desktop' ? 'bg-primary text-white' : 'text-secondary hover:bg-accent'}`}
               >
                 <Monitor size={18} />
               </button>
               <button 
                onClick={() => setPreviewMode('mobile')}
                className={`p-2 rounded-full transition-colors ${previewMode === 'mobile' ? 'bg-primary text-white' : 'text-secondary hover:bg-accent'}`}
               >
                 <Smartphone size={18} />
               </button>
             </div>
             <button 
              onClick={() => setPreviewTheme(previewTheme === 'light' ? 'dark' : 'light')}
              className={`p-2 rounded-full transition-colors ${previewTheme === 'dark' ? 'bg-zinc-800 text-yellow-400' : 'text-secondary hover:bg-accent'}`}
              title={`Switch to ${previewTheme === 'light' ? 'Dark' : 'Light'} Mode`}
             >
               {previewTheme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
             </button>
          </div>

          {/* Iframe Container */}
          <motion.div 
            animate={{ 
              width: previewMode === 'desktop' ? '100%' : '375px',
              height: previewMode === 'desktop' ? '100%' : '667px',
              borderRadius: previewMode === 'desktop' ? '0px' : '24px'
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-white shadow-2xl overflow-hidden border border-border relative group"
          >
            {previewMode === 'mobile' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20" />
            )}
            
            {/* The Preview Iframe */}
            <iframe 
              srcDoc={htmlPreview}
              className="w-full h-full border-none"
              title="Site Preview"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
