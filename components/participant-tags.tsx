'use client';

import { useState } from 'react';

export function ParticipantTags({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const normalized = input.trim();
    if (!normalized || value.includes(normalized)) return;
    onChange([...value, normalized]);
    setInput('');
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-zinc-700">Participants</label>
      <div className="flex gap-2">
        <input
          className="w-full rounded-xl border border-pink-200 bg-white px-3 py-2 outline-none ring-pink-200 transition focus:ring"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Add a name"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              addTag();
            }
          }}
        />
        <button className="cute-button" type="button" onClick={addTag}>
          Add
        </button>
      </div>
      <div className="flex min-h-8 flex-wrap gap-2">
        {value.map((tag) => (
          <button
            key={tag}
            type="button"
            className="rounded-full border border-pink-200 bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700 hover:bg-pink-200"
            onClick={() => onChange(value.filter((person) => person !== tag))}
          >
            {tag} ✕
          </button>
        ))}
      </div>
    </div>
  );
}
