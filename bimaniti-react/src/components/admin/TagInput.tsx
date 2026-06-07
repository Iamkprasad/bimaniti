import { useState, useCallback } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
}

export function TagInput({ value, onChange, placeholder = 'Add tag and press Enter', label = 'Tags' }: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = useCallback(() => {
    const tag = input.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput('');
  }, [input, value, onChange]);

  const removeTag = useCallback((tag: string) => {
    onChange(value.filter(t => t !== tag));
  }, [value, onChange]);

  return (
    <div className="tag-input">
      <label className="admin-label">{label}</label>
      <div className="tag-chips">
        {value.map(tag => (
          <span key={tag} className="tag-chip">
            {tag}
            <button type="button" onClick={() => removeTag(tag)}>
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') { e.preventDefault(); addTag(); }
          if (e.key === ',' ) { e.preventDefault(); addTag(); }
        }}
        placeholder={placeholder}
        className="admin-input"
      />
    </div>
  );
}
