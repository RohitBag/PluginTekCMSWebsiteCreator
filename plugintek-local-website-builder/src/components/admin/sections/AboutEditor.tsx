'use client'

import React from 'react';
import { useSite } from '@/store/SiteContext';
import { FormSection, InputField, TextAreaField, ImageUpload } from '../CMSField';

export default function AboutEditor() {
  const { config, updateConfig } = useSite();
  const about = config.sections.about;

  const updateAbout = (key: string, value: any) => {
    updateConfig(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        about: { ...prev.sections.about, [key]: value }
      }
    }));
  };

  return (
    <div className="space-y-8 pb-20">
      <FormSection title="Main Content">
        <InputField label="Sub-label (Badge)" value={about.sublabel || ''} onChange={(v) => updateAbout('sublabel', v)} placeholder="e.g. OUR STORY" />
        <InputField label="Heading" value={about.title} onChange={(v) => updateAbout('title', v)} />
        <TextAreaField label="Description" value={about.desc} onChange={(v) => updateAbout('desc', v)} />
        <ImageUpload label="Section Image" value={about.image_url || ''} onChange={(v) => updateAbout('image_url', v)} />
      </FormSection>

      <FormSection title="Profile Subsection (Optional)">
        <InputField label="Profile Name / Title" value={about.profile_title || ''} onChange={(v) => updateAbout('profile_title', v)} />
        <TextAreaField label="Profile Description" value={about.profile_desc || ''} onChange={(v) => updateAbout('profile_desc', v)} />
      </FormSection>
    </div>
  );
}
