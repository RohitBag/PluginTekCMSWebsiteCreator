'use client'

import React from 'react';
import { useSite } from '@/store/SiteContext';
import ListManager from './ListManager';
import { InputField, TextAreaField, FormSection, SelectField } from '../CMSField';
import { CustomSection } from '@/types/cms';

export default function CustomEditor() {
  const { config, updateConfig } = useSite();

  const handleUpdate = (newList: CustomSection[]) => {
    updateConfig(prev => ({
      ...prev,
      content: { ...prev.content, custom: newList }
    }));
  };

  return (
    <div className="space-y-8 pb-20">
      <ListManager<CustomSection>
        title="Custom Sections"
        items={config.content.custom}
        onUpdate={handleUpdate}
        getItemLabel={(item) => item.title}
        createDefault={() => ({
          id: Math.random().toString(36).substr(2, 9),
          title: "New Custom Section",
          content: "<section>\n  <h2>My Section</h2>\n</section>",
          css: "h2 { color: var(--primary); }",
          is_html: true
        })}
        renderForm={(item, onChange) => (
          <div className="space-y-4">
            <InputField label="Section Title" value={item.title} onChange={(v) => onChange({ ...item, title: v })} />
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">HTML Content</label>
              <textarea 
                value={item.content} 
                onChange={(e) => onChange({ ...item, content: e.target.value })}
                rows={8}
                className="w-full bg-zinc-950 text-green-400 font-mono text-xs px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">CSS Styles (Scope to this section)</label>
              <textarea 
                value={item.css || ''} 
                onChange={(e) => onChange({ ...item, css: e.target.value })}
                rows={5}
                className="w-full bg-zinc-950 text-blue-400 font-mono text-xs px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            
            <FormSection title="Mobile Specifics">
               <SelectField 
                label="Custom Mobile Content?" 
                value={item.is_mobile_custom ? 'yes' : 'no'} 
                onChange={(v) => onChange({ ...item, is_mobile_custom: v === 'yes' })}
                options={[{label: 'No', value: 'no'}, {label: 'Yes', value: 'yes'}]}
               />
               {item.is_mobile_custom && (
                 <div className="space-y-4 pt-2">
                    <TextAreaField label="Mobile HTML" value={item.mobile_content || ''} onChange={(v) => onChange({ ...item, mobile_content: v })} />
                    <TextAreaField label="Mobile CSS" value={item.mobile_css || ''} onChange={(v) => onChange({ ...item, mobile_css: v })} />
                 </div>
               )}
            </FormSection>
          </div>
        )}
      />
    </div>
  );
}
