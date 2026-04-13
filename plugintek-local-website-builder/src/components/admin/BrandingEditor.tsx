'use client'

import React from 'react';
import { useSite } from '@/store/SiteContext';
import { FormSection, InputField, ColorField, SelectField, ImageUpload } from './CMSField';

export default function BrandingEditor() {
  const { config, updateConfig } = useSite();

  const updateMetadata = (key: string, value: any) => {
    updateConfig(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [key]: value }
    }));
  };

  const updateLogo = (key: string, value: any) => {
    updateConfig(prev => ({
      ...prev,
      logo: { ...prev.logo, [key]: value }
    }));
  };

  return (
    <div className="space-y-8 pb-20">
      <FormSection title="Site Identity">
        <InputField 
          label="Site Name" 
          value={config.metadata.siteName} 
          onChange={(v) => updateMetadata('siteName', v)} 
          placeholder="e.g. My Plugintek Site"
        />
      </FormSection>

      <FormSection title="Theme Colors">
        <div className="grid grid-cols-1 gap-4">
          <ColorField 
            label="Primary Color" 
            value={config.metadata.primaryColor} 
            onChange={(v) => updateMetadata('primaryColor', v)} 
          />
          <ColorField 
            label="Secondary Color" 
            value={config.metadata.secondaryColor} 
            onChange={(v) => updateMetadata('secondaryColor', v)} 
          />
        </div>
      </FormSection>

      <FormSection title="Logo Design">
        <SelectField 
          label="Logo Type"
          value={config.logo.type}
          onChange={(v) => updateLogo('type', v)}
          options={[
            { label: 'Text Only', value: 'text' },
            { label: 'Image Only', value: 'image' },
          ]}
        />

        {config.logo.type === 'text' ? (
          <div className="space-y-4 p-4 bg-accent/5 rounded-xl border border-border">
            <InputField 
              label="Logo Text" 
              value={config.logo.text || ''} 
              onChange={(v) => updateLogo('text', v)} 
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Font Weight" value={config.logo.weight || '700'} onChange={(v) => updateLogo('weight', v)} />
              <InputField label="Font Size (px)" value={config.logo.size || '24'} onChange={(v) => updateLogo('size', v)} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ImageUpload 
              label="Light Mode Logo" 
              value={config.logo.url_light || ''} 
              onChange={(v) => updateLogo('url_light', v)} 
            />
            <ImageUpload 
              label="Dark Mode Logo" 
              value={config.logo.url_dark || ''} 
              onChange={(v) => updateLogo('url_dark', v)} 
            />
          </div>
        )}
      </FormSection>

      <FormSection title="Favicon">
        <SelectField 
          label="Favicon Type"
          value={config.metadata.favicon_type || 'icon'}
          onChange={(v) => updateMetadata('favicon_type', v)}
          options={[
            { label: 'FontAwesome Icon', value: 'icon' },
            { label: 'Image File', value: 'image' },
          ]}
        />
        {config.metadata.favicon_type === 'icon' ? (
          <InputField 
            label="FontAwesome Class"
            value={config.metadata.favicon_icon || ''}
            onChange={(v) => updateMetadata('favicon_icon', v)}
            placeholder="e.g. fa-solid fa-star"
          />
        ) : (
          <ImageUpload 
            label="Favicon Image"
            value={config.metadata.favicon_url || ''}
            onChange={(v) => updateMetadata('favicon_url', v)}
          />
        )}
      </FormSection>
      <FormSection title="Navigation Menu">
        <p className="text-xs text-secondary mb-2">Manage the links in your site header.</p>
        <div className="space-y-2">
          {config.metadata.navigation?.map((nav, i) => (
            <div key={nav.id} className="flex gap-2 bg-accent/5 p-2 rounded-lg border border-border">
              <input 
                value={nav.label} 
                onChange={(e) => {
                  const newList = [...config.metadata.navigation];
                  newList[i].label = e.target.value;
                  updateMetadata('navigation', newList);
                }}
                placeholder="Label"
                className="flex-1 bg-white border border-border rounded px-2 py-1 text-xs outline-none"
              />
              <input 
                value={nav.url} 
                onChange={(e) => {
                  const newList = [...config.metadata.navigation];
                  newList[i].url = e.target.value;
                  updateMetadata('navigation', newList);
                }}
                placeholder="#section"
                className="flex-1 bg-white border border-border rounded px-2 py-1 text-xs outline-none font-mono"
              />
              <button 
                onClick={() => {
                  const newList = config.metadata.navigation.filter((_, idx) => idx !== i);
                  updateMetadata('navigation', newList);
                }}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                 <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button 
            onClick={() => {
              const newList = [...(config.metadata.navigation || []), { id: Math.random().toString(), label: "New Link", url: "#" }];
              updateMetadata('navigation', newList);
            }}
            className="text-xs font-bold text-primary flex items-center gap-1 hover:underline pt-1"
          >
            <Plus size={14} /> Add Menu Item
          </button>
        </div>
      </FormSection>
      <FormSection title="Footer Branding">
        <InputField 
          label="Footer Tagline" 
          value={config.metadata.footer_tagline || ''} 
          onChange={(v) => updateMetadata('footer_tagline', v)} 
          placeholder="e.g. Excellence in Every Project"
        />
        <ColorField 
          label="Footer Background" 
          value={config.metadata.footer_bg_color || '#0f172a'} 
          onChange={(v) => updateMetadata('footer_bg_color', v)} 
        />
        
        <div className="space-y-4 pt-4 border-t border-border mt-4">
          <label className="text-xs font-bold uppercase text-secondary">Compliance Info</label>
          <div className="space-y-2">
            {(config.metadata.compliance_info || []).map((info, i) => (
              <div key={i} className="flex gap-2">
                <input 
                  value={info.label} 
                  onChange={(e) => {
                    const newList = [...(config.metadata.compliance_info || [])];
                    newList[i].label = e.target.value;
                    updateMetadata('compliance_info', newList);
                  }}
                  placeholder="Label (e.g. Reg)"
                  className="w-1/3 bg-white border border-border rounded px-2 py-1 text-xs outline-none"
                />
                <input 
                  value={info.value} 
                  onChange={(e) => {
                    const newList = [...(config.metadata.compliance_info || [])];
                    newList[i].value = e.target.value;
                    updateMetadata('compliance_info', newList);
                  }}
                  placeholder="Value"
                  className="flex-1 bg-white border border-border rounded px-2 py-1 text-xs outline-none"
                />
                <button 
                  onClick={() => {
                    const newList = config.metadata.compliance_info?.filter((_, idx) => idx !== i);
                    updateMetadata('compliance_info', newList);
                  }}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                   <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button 
              onClick={() => {
                const newList = [...(config.metadata.compliance_info || []), { label: "", value: "" }];
                updateMetadata('compliance_info', newList);
              }}
              className="text-xs font-bold text-primary flex items-center gap-1 hover:underline pt-1"
            >
              <Plus size={14} /> Add Compliance Row
            </button>
          </div>
        </div>
      </FormSection>
    </div>
  );
}

import { Trash2, Plus } from 'lucide-react';
