'use client'

import React from 'react';
import { useSite } from '@/store/SiteContext';
import { FormSection, InputField, SelectField, TextAreaField, ColorField, ImageUpload } from '../CMSField';

export default function HeroEditor() {
  const { config, updateConfig } = useSite();
  const hero = config.sections.hero;

  const updateHero = (key: string, value: any) => {
    updateConfig(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        hero: { ...prev.sections.hero, [key]: value }
      }
    }));
  };

  return (
    <div className="space-y-8 pb-20">
      <FormSection title="Core Content">
        <InputField label="Pill / Badge Text" value={hero.badge_text || ''} onChange={(v) => updateHero('badge_text', v)} placeholder="e.g. NEW RELEASE" />
        <ColorField label="Badge Color" value={hero.badge_color || '#f59e0b'} onChange={(v) => updateHero('badge_color', v)} />
        <InputField label="Hero Title" value={hero.title} onChange={(v) => updateHero('title', v)} />
        <InputField label="Highlight Text" description="Specific word(s) to colorize" value={hero.highlight_text || ''} onChange={(v) => updateHero('highlight_text', v)} />
        <div className="grid grid-cols-2 gap-4">
          <ColorField label="Highlight Color" value={hero.highlight_color || '#f59e0b'} onChange={(v) => updateHero('highlight_color', v)} />
          <SelectField 
            label="Title Size"
            value={hero.title_size || 'base'}
            onChange={(v) => updateHero('title_size', v)}
            options={[
              { label: 'Small', value: 'small' },
              { label: 'Normal', value: 'base' },
              { label: 'Large', value: 'large' },
              { label: 'Extra Large', value: 'xl' },
            ]}
          />
        </div>
        <TextAreaField label="Subtitle" value={hero.subtitle} onChange={(v) => updateHero('subtitle', v)} />
        
        <div className="pt-4 border-t border-border mt-4 space-y-4">
          <SelectField 
            label="Main Text Style"
            value={hero.text_color_mode || 'auto'}
            onChange={(v) => updateHero('text_color_mode', v)}
            options={[
              { label: 'Automatic (Smart White)', value: 'auto' },
              { label: 'Custom Colors', value: 'custom' },
            ]}
          />
          {hero.text_color_mode === 'custom' && (
            <ColorField label="Text Color" value={hero.text_color || '#ffffff'} onChange={(v) => updateHero('text_color', v)} />
          )}
          <SelectField 
            label="Text Alignment"
            value={hero.text_align || 'center'}
            onChange={(v) => updateHero('text_align', v)}
            options={[
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' },
            ]}
          />
        </div>
      </FormSection>

      <FormSection title="Call to Action Buttons">
        <div className="p-4 bg-accent/5 rounded-xl border border-border space-y-4">
          <h4 className="text-xs font-bold uppercase text-secondary">Primary Button</h4>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Label" value={hero.cta_primary || ''} onChange={(v) => updateHero('cta_primary', v)} />
            <InputField label="Link" value={hero.cta_primary_link || ''} onChange={(v) => updateHero('cta_primary_link', v)} />
          </div>
          <div className="grid grid-cols-2 gap-4 items-end">
            <ColorField label="Color" value={hero.cta_primary_color || '#f59e0b'} onChange={(v) => updateHero('cta_primary_color', v)} />
            <SelectField 
              label="Border Radius"
              value={hero.cta_border_radius || 'full'}
              onChange={(v) => updateHero('cta_border_radius', v)}
              options={[
                { label: 'None', value: 'none' },
                { label: 'Medium', value: 'md' },
                { label: 'Extra Large', value: 'xl' },
                { label: 'Full', value: 'full' },
              ]}
            />
          </div>
        </div>

        <div className="p-4 bg-accent/5 rounded-xl border border-border space-y-4">
          <h4 className="text-xs font-bold uppercase text-secondary">Secondary Button</h4>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Label" value={hero.cta_secondary || ''} onChange={(v) => updateHero('cta_secondary', v)} />
            <InputField label="Link" value={hero.cta_secondary_link || ''} onChange={(v) => updateHero('cta_secondary_link', v)} />
          </div>
          <ColorField label="Color" value={hero.cta_secondary_color || '#71717a'} onChange={(v) => updateHero('cta_secondary_color', v)} />
        </div>
      </FormSection>

      <FormSection title="Background Design">
        <SelectField 
          label="Background Type"
          value={hero.bg_type}
          onChange={(v) => updateHero('bg_type', v)}
          options={[
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
            { label: 'Gradient', value: 'gradient' },
            { label: 'Solid Color', value: 'solid' },
          ]}
        />

        {hero.bg_type === 'image' && (
          <div className="space-y-4">
            <ImageUpload label="Background Image" value={hero.bg_image_url || ''} onChange={(v) => updateHero('bg_image_url', v)} />
            <SelectField 
              label="Image Behavior"
              value={hero.bg_image_scroll ? 'scroll' : 'fixed'}
              onChange={(v) => updateHero('bg_image_scroll', v === 'scroll')}
              options={[
                { label: 'Fixed / Static', value: 'fixed' },
                { label: 'Horizontal Scroll', value: 'scroll' },
              ]}
            />
          </div>
        )}

        {hero.bg_type === 'video' && (
          <InputField label="Video URL (Direct MP4 link)" value={hero.bg_video_url || ''} onChange={(v) => updateHero('bg_video_url', v)} placeholder="https://..." />
        )}

        {(hero.bg_type === 'gradient' || hero.bg_type === 'solid') && (
          <div className="grid grid-cols-1 gap-4">
            <ColorField label="Color Start" value={hero.bg_color_start || '#0f172a'} onChange={(v) => updateHero('bg_color_start', v)} />
             {hero.bg_type === 'gradient' && (
               <ColorField label="Color End" value={hero.bg_color_end || '#1e1b4b'} onChange={(v) => updateHero('bg_color_end', v)} />
             )}
          </div>
        )}

        {(hero.bg_type === 'image' || hero.bg_type === 'video') && (
          <div className="p-4 bg-accent/5 rounded-xl border border-border space-y-4">
            <h4 className="text-xs font-bold uppercase text-secondary">Overlay Gradient</h4>
            <div className="grid grid-cols-2 gap-4">
               <ColorField label="Color Start" value={hero.overlay_color_start || '#000000'} onChange={(v) => updateHero('overlay_color_start', v)} />
               <ColorField label="Color End" value={hero.overlay_color_end || '#000000'} onChange={(v) => updateHero('overlay_color_end', v)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-secondary">Opacity ({hero.overlay_opacity_start || 60}%)</label>
              <input 
                type="range" min="0" max="100" step="5"
                value={hero.overlay_opacity_start || 60}
                onChange={(e) => updateHero('overlay_opacity_start', parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>
        )}
      </FormSection>

      <FormSection title="Side Cutout & Overlay Card">
        <ImageUpload label="Cutout Image" description="Add a transparent PNG to overlap the hero" value={hero.cutout_image_url || ''} onChange={(v) => updateHero('cutout_image_url', v)} />
        {hero.cutout_image_url && (
          <div className="grid grid-cols-2 gap-4">
            <SelectField 
              label="Position"
              value={hero.cutout_position || 'right'}
              onChange={(v) => updateHero('cutout_position', v)}
              options={[{ label: 'Left', value: 'left' }, { label: 'Right', value: 'right' }]}
            />
            <SelectField 
              label="Size"
              value={hero.cutout_size || 'large'}
              onChange={(v) => updateHero('cutout_size', v)}
              options={[
                { label: 'Small', value: 'small' },
                { label: 'Medium', value: 'medium' },
                { label: 'Large', value: 'large' },
                { label: 'XL', value: 'xl' },
              ]}
            />
          </div>
        )}

        <div className="p-4 bg-accent/5 rounded-xl border border-border space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase text-secondary">Overlay Card</h4>
            <input 
              type="checkbox" 
              checked={hero.overlay_card?.show || false} 
              onChange={(e) => updateHero('overlay_card', { ...hero.overlay_card, show: e.target.checked })}
              className="accent-primary h-4 w-4"
            />
          </div>
          
          {(hero.overlay_card?.show) && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Card Icon" value={hero.overlay_card.icon || ''} onChange={(v) => updateHero('overlay_card', { ...hero.overlay_card, icon: v })} placeholder="fa-solid fa-star" />
                <SelectField 
                  label="Card Position"
                  value={hero.overlay_card.position || 'bottom-right'}
                  onChange={(v) => updateHero('overlay_card', { ...hero.overlay_card, position: v })}
                  options={[
                    { label: 'Bottom Left', value: 'bottom-left' },
                    { label: 'Bottom Right', value: 'bottom-right' },
                    { label: 'Top Left', value: 'top-left' },
                    { label: 'Top Right', value: 'top-right' },
                  ]}
                />
              </div>
              <InputField label="Card Title" value={hero.overlay_card.title || ''} onChange={(v) => updateHero('overlay_card', { ...hero.overlay_card, title: v })} />
              <TextAreaField label="Card Text" value={hero.overlay_card.text || ''} onChange={(v) => updateHero('overlay_card', { ...hero.overlay_card, text: v })} />
            </div>
          )}
        </div>
      </FormSection>
    </div>
  );
}
