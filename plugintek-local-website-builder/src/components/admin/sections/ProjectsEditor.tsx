'use client'

import React from 'react';
import { useSite } from '@/store/SiteContext';
import ListManager from './ListManager';
import { InputField, TextAreaField, FormSection, ImageUpload } from '../CMSField';
import { ProjectItem } from '@/types/cms';
import { Trash2 } from 'lucide-react';

export default function ProjectsEditor() {
  const { config, updateConfig } = useSite();

  const handleUpdate = (newList: ProjectItem[]) => {
    updateConfig(prev => ({
      ...prev,
      content: { ...prev.content, projects: newList }
    }));
  };

  return (
    <div className="space-y-8 pb-20">
      <FormSection title="Portfolio Header">
        <InputField 
          label="Main Heading" 
          value={config.sections.projects?.header || ''} 
          onChange={(v) => updateConfig(prev => ({ ...prev, sections: { ...prev.sections, projects: { ...prev.sections.projects, header: v } } }))} 
        />
        <InputField 
          label="Sub-label" 
          value={config.sections.projects?.sublabel || ''} 
          onChange={(v) => updateConfig(prev => ({ ...prev, sections: { ...prev.sections, projects: { ...prev.sections.projects, sublabel: v } } }))} 
        />
      </FormSection>

      <ListManager<ProjectItem>
        title="Projects"
        items={config.content.projects}
        onUpdate={handleUpdate}
        getItemLabel={(item) => item.title}
        createDefault={() => ({
          id: Math.random().toString(36).substr(2, 9),
          title: "New Project",
          location: "City, Country",
          description: "Project details...",
          images: []
        })}
        renderForm={(item, onChange) => (
          <div className="space-y-4">
            <InputField label="Project Title" value={item.title} onChange={(v) => onChange({ ...item, title: v })} />
            <InputField label="Location" value={item.location || ''} onChange={(v) => onChange({ ...item, location: v })} />
            <TextAreaField label="Description" value={item.description || ''} onChange={(v) => onChange({ ...item, description: v })} />
            
            <FormSection title="Project Gallery">
               <ImageUpload 
                  label="Add Image" 
                  value="" 
                  onChange={(v) => v && onChange({ ...item, images: [...item.images, v] })} 
               />
               <div className="grid grid-cols-4 gap-2 mt-2">
                 {item.images.map((img, i) => (
                   <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={img} alt="" className="w-full h-full object-cover" />
                     <button 
                        onClick={() => onChange({ ...item, images: item.images.filter((_, idx) => idx !== i) })}
                        className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                     >
                       <Trash2 size={14} />
                     </button>
                   </div>
                 ))}
               </div>
            </FormSection>
          </div>
        )}
      />
    </div>
  );
}
