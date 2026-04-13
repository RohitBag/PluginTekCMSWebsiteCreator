'use client'

import React from 'react';
import { useSite } from '@/store/SiteContext';
import { LucideIcon } from 'lucide-react';

interface FormFieldProps {
  label: string;
  description?: string;
  icon?: LucideIcon;
}

export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 pt-4 first:pt-0">
      <h3 className="text-sm font-bold text-secondary uppercase tracking-wider">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function InputField({ label, description, value, onChange, placeholder, type = 'text' }: { 
  label: string; 
  description?: string; 
  value: string | number; 
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      {description && <p className="text-xs text-secondary">{description}</p>}
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-accent/20 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
      />
    </div>
  );
}

export function TextAreaField({ label, description, value, onChange, placeholder }: { 
  label: string; 
  description?: string; 
  value: string; 
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      {description && <p className="text-xs text-secondary">{description}</p>}
      <textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-accent/20 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
      />
    </div>
  );
}

export function SelectField({ label, description, value, onChange, options }: { 
  label: string; 
  description?: string; 
  value: string; 
  onChange: (val: string) => void;
  options: { label: string; value: string } [];
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      {description && <p className="text-xs text-secondary">{description}</p>}
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-accent/20 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export function ColorField({ label, value, onChange }: { 
  label: string; 
  value: string; 
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-accent/10 border border-border rounded-xl">
      <div className="space-y-0.5">
        <label className="text-sm font-semibold text-foreground">{label}</label>
        <span className="text-xs font-mono text-secondary tabular-nums uppercase">{value}</span>
      </div>
      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border">
        <input 
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute -inset-2 w-[140%] h-[140%] cursor-pointer"
        />
      </div>
    </div>
  );
}

export function ImageUpload({ label, description, value, onChange }: { 
  label: string; 
  description?: string; 
  value: string; 
  onChange: (val: string) => void;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      {description && <p className="text-xs text-secondary">{description}</p>}
      <div className="flex items-center gap-4">
        {value && (
          <div className="relative group w-20 h-20 rounded-lg overflow-hidden border border-border bg-accent/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="w-full h-full object-contain" />
            <button 
              onClick={() => onChange('')}
              className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold"
            >
              Remove
            </button>
          </div>
        )}
        <label className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer ${value ? 'h-20' : 'h-32'}`}>
          <div className="flex flex-col items-center gap-1 text-secondary">
            {!value && <span className="text-2xl">📁</span>}
            <span className="text-xs font-medium">{value ? 'Change Image' : 'Select Image'}</span>
          </div>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      </div>
    </div>
  );
}
