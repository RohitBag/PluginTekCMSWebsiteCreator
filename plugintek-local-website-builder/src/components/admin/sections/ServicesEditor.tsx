'use client'

import React from 'react';
import { useSite } from '@/store/SiteContext';
import ListManager from './ListManager';
import { InputField, TextAreaField, FormSection } from '../CMSField';
import { ServiceItem } from '@/types/cms';

export default function ServicesEditor() {
  const { config, updateConfig } = useSite();

  const handleUpdate = (newList: ServiceItem[]) => {
    updateConfig(prev => ({
      ...prev,
      content: { ...prev.content, services: newList }
    }));
  };

  return (
    <div className="space-y-8 pb-20">
      <FormSection title="Services Header">
        <InputField 
          label="Main Heading" 
          value={config.sections.services?.header || ''} 
          onChange={(v) => updateConfig(prev => ({ ...prev, sections: { ...prev.sections, services: { ...prev.sections.services, header: v } } }))} 
        />
        <InputField 
          label="Sub-label" 
          value={config.sections.services?.sublabel || ''} 
          onChange={(v) => updateConfig(prev => ({ ...prev, sections: { ...prev.sections, services: { ...prev.sections.services, sublabel: v } } }))} 
        />
      </FormSection>

      <ListManager<ServiceItem>
        title="Services"
        items={config.content.services}
        onUpdate={handleUpdate}
        getItemLabel={(item) => item.title}
        createDefault={() => ({
          id: Math.random().toString(36).substr(2, 9),
          title: "New Service",
          description: "Description of your service...",
          icon: "fa-solid fa-gear"
        })}
        renderForm={(item, onChange) => (
          <div className="space-y-4">
            <InputField label="Title" value={item.title} onChange={(v) => onChange({ ...item, title: v })} />
            <InputField label="Icon (FontAwesome Class)" value={item.icon} onChange={(v) => onChange({ ...item, icon: v })} />
            <TextAreaField label="Description" value={item.description} onChange={(v) => onChange({ ...item, description: v })} />
            <InputField label="Page Link (Optional)" value={item.page_url || ''} onChange={(v) => onChange({ ...item, page_url: v })} />
          </div>
        )}
      />
    </div>
  );
}
