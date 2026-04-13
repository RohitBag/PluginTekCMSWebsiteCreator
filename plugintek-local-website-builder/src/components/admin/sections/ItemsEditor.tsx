'use client'

import React from 'react';
import { useSite } from '@/store/SiteContext';
import ListManager from './ListManager';
import { InputField, TextAreaField, FormSection, ImageUpload } from '../CMSField';
import { FeatureItem } from '@/types/cms';
import { Trash2 } from 'lucide-react';

export default function ItemsEditor() {
  const { config, updateConfig } = useSite();

  const handleUpdate = (newList: FeatureItem[]) => {
    updateConfig(prev => ({
      ...prev,
      content: { ...prev.content, items: newList }
    }));
  };

  return (
    <div className="space-y-8 pb-20">
      <FormSection title="Items Header">
        <InputField 
          label="Main Heading" 
          value={config.sections.items?.header || ''} 
          onChange={(v) => updateConfig(prev => ({ ...prev, sections: { ...prev.sections, items: { ...prev.sections.items, header: v } } }))} 
        />
        <InputField 
          label="Sub-label" 
          value={config.sections.items?.sublabel || ''} 
          onChange={(v) => updateConfig(prev => ({ ...prev, sections: { ...prev.sections, items: { ...prev.sections.items, sublabel: v } } }))} 
        />
      </FormSection>

      <ListManager<FeatureItem>
        title="Featured Items"
        items={config.content.items}
        onUpdate={handleUpdate}
        getItemLabel={(item) => item.title}
        createDefault={() => ({
          id: Math.random().toString(36).substr(2, 9),
          title: "New Item",
          description: "Details about this item...",
          price: 0,
          location: "Location",
          action_label: "Contact Us",
          action_url: "#contact",
          images: []
        })}
        renderForm={(item, onChange) => (
          <div className="space-y-4">
            <InputField label="Item Title" value={item.title} onChange={(v) => onChange({ ...item, title: v })} />
            <div className="grid grid-cols-2 gap-4">
               <InputField label="Price (e.g. 100)" type="number" value={item.price || 0} onChange={(v) => onChange({ ...item, price: parseInt(v) || 0 })} />
               <InputField label="Location" value={item.location || ''} onChange={(v) => onChange({ ...item, location: v })} />
            </div>
            <TextAreaField label="Description" value={item.description || ''} onChange={(v) => onChange({ ...item, description: v })} />
            <div className="grid grid-cols-2 gap-4">
               <InputField label="Action Label" value={item.action_label || 'Contact Us'} onChange={(v) => onChange({ ...item, action_label: v })} />
               <InputField label="Action URL" value={item.action_url || '#contact'} onChange={(v) => onChange({ ...item, action_url: v })} />
            </div>

            <FormSection title="Item Gallery">
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
