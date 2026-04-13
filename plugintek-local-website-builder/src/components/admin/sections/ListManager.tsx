'use client'

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { FormSection, InputField, TextAreaField, ImageUpload } from '../CMSField';
import { motion, AnimatePresence } from 'framer-motion';

interface ListManagerProps<T> {
  title: string;
  items: T[];
  onUpdate: (items: T[]) => void;
  renderForm: (item: T, onChange: (updated: T) => void) => React.ReactNode;
  getItemLabel: (item: T) => string;
  createDefault: () => T;
}

export default function ListManager<T extends { id: string }>({ 
  title, 
  items, 
  onUpdate, 
  renderForm, 
  getItemLabel,
  createDefault
}: ListManagerProps<T>) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addItem = () => {
    const newItem = createDefault();
    onUpdate([...items, newItem]);
    setEditingId(newItem.id);
  };

  const removeItem = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      onUpdate(items.filter(i => i.id !== id));
      if (editingId === id) setEditingId(null);
    }
  };

  const updateItem = (updated: T) => {
    onUpdate(items.map(i => i.id === updated.id ? updated : i));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < items.length) {
      [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
      onUpdate(newItems);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{title}</h3>
        <button 
          onClick={addItem}
          className="bg-primary text-white p-2 rounded-full hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item.id} className="border border-border rounded-xl bg-white dark:bg-zinc-900 overflow-hidden">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-accent/5 transition-colors"
              onClick={() => setEditingId(editingId === item.id ? null : item.id)}
            >
              <div className="flex items-center gap-3">
                <div className="bg-accent/20 p-2 rounded-lg text-secondary">
                   {getItemLabel(item).includes('Image') ? <ImageIcon size={18} /> : <div className="w-5 h-5 flex items-center justify-center font-bold text-xs">{index + 1}</div>}
                </div>
                <h4 className="font-semibold text-sm">{getItemLabel(item) || `Untitled ${title.slice(0, -1)}`}</h4>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); moveItem(index, 'up'); }}
                  disabled={index === 0}
                  className="p-1.5 text-secondary hover:bg-accent rounded-md disabled:opacity-30"
                >
                  <ChevronUp size={16} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); moveItem(index, 'down'); }}
                  disabled={index === items.length - 1}
                  className="p-1.5 text-secondary hover:bg-accent rounded-md disabled:opacity-30"
                >
                  <ChevronDown size={16} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {editingId === item.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-accent/5 border-t border-border"
                >
                  <div className="p-4 space-y-4">
                    {renderForm(item, updateItem)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      
      {items.length === 0 && (
        <div className="p-12 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-secondary">
          <p className="text-sm font-medium">No items added yet</p>
          <button onClick={addItem} className="text-primary text-xs font-bold mt-2 hover:underline">Add your first {title.slice(0, -1)}</button>
        </div>
      )}
    </div>
  );
}
