'use client'

import React from 'react';
import { useSite } from '@/store/SiteContext';
import { FormSection, InputField, TextAreaField, SelectField } from '../CMSField';
import { Plus, Trash2 } from 'lucide-react';

export default function ContactEditor() {
  const { config, updateConfig } = useSite();
  const contact = config.sections.contact;

  const updateContact = (key: string, value: any) => {
    updateConfig(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        contact: { ...prev.sections.contact, [key]: value }
      }
    }));
  };

  const handleListChange = (key: 'phones' | 'emails', index: number, value: string) => {
    const list = [...contact[key]];
    list[index] = value;
    updateContact(key, list);
  };

  const addItem = (key: 'phones' | 'emails') => {
    updateContact(key, [...contact[key], '']);
  };

  const removeItem = (key: 'phones' | 'emails', index: number) => {
    updateContact(key, contact[key].filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 pb-20">
      <FormSection title="Headers">
        <InputField label="Badge / Sublabel" value={contact.sublabel || ''} onChange={(v) => updateContact('sublabel', v)} />
        <InputField label="Main Heading" value={contact.header || ''} onChange={(v) => updateContact('header', v)} />
      </FormSection>

      <FormSection title="Contact Info & Card Titles">
        <div className="p-4 bg-accent/5 rounded-xl border border-border space-y-4">
          <h4 className="text-xs font-bold uppercase text-secondary">Phone Card</h4>
          <InputField label="Card Title" placeholder="e.g. Call Us" value={contact.card_phone_title || ''} onChange={(v) => updateContact('card_phone_title', v)} />
          <div className="space-y-2">
            {contact.phones.map((phone, i) => (
              <div key={i} className="flex gap-2">
                <input 
                  value={phone} 
                  onChange={(e) => handleListChange('phones', i, e.target.value)}
                  className="flex-1 bg-white dark:bg-zinc-800 border border-border rounded-lg px-3 py-2 text-sm"
                />
                <button onClick={() => removeItem('phones', i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
              </div>
            ))}
            <button onClick={() => addItem('phones')} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"><Plus size={14} /> Add Phone</button>
          </div>
        </div>

        <div className="p-4 bg-accent/5 rounded-xl border border-border space-y-4">
          <h4 className="text-xs font-bold uppercase text-secondary">Email Card</h4>
          <InputField label="Card Title" placeholder="e.g. Email Us" value={contact.card_email_title || ''} onChange={(v) => updateContact('card_email_title', v)} />
          <div className="space-y-2">
            {contact.emails.map((email, i) => (
              <div key={i} className="flex gap-2">
                <input 
                  value={email} 
                  onChange={(e) => handleListChange('emails', i, e.target.value)}
                  className="flex-1 bg-white dark:bg-zinc-800 border border-border rounded-lg px-3 py-2 text-sm"
                />
                <button onClick={() => removeItem('emails', i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
              </div>
            ))}
            <button onClick={() => addItem('emails')} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"><Plus size={14} /> Add Email</button>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <InputField label="Fee Label" placeholder="Consultation Fee" value={contact.fee_label || ''} onChange={(v) => updateContact('fee_label', v)} />
            <InputField label="Fee Amount" placeholder="$ 100.00" value={contact.consultation_fee || ''} onChange={(v) => updateContact('consultation_fee', v)} />
          </div>
        </div>
      </FormSection>

      <FormSection title="Location & Map">
        <InputField label="Visit Card Title" placeholder="e.g. Visit Us" value={contact.card_visit_title || ''} onChange={(v) => updateContact('card_visit_title', v)} />
        <InputField label="Location Label" placeholder="Office Location:" value={contact.clinic_label || ''} onChange={(v) => updateContact('clinic_label', v)} />
        <TextAreaField label="Full Address" value={contact.address || ''} onChange={(v) => updateContact('address', v)} />
        <TextAreaField label="Clinic Note (Italic)" placeholder="e.g. Appointments required..." value={contact.clinic_note || ''} onChange={(v) => updateContact('clinic_note', v)} />
        <InputField label="Google Maps URL" description="Link to your location on Maps" value={contact.map_url || ''} onChange={(v) => updateContact('map_url', v)} />
      </FormSection>
    </div>
  );
}
